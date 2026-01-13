import type { PiniaPluginContext, StateTree, Store, StoreGeneric } from 'pinia';
import type { Persistence, PersistenceOptions } from './types';
import { deepOmitUnsafe, deepPickUnsafe } from 'deep-pick-omit';

const consoleError = (err: unknown, debug: boolean = false) => {
  if (debug && err) console.error('@packages/pinia-plugin-persisted', err);
};

// 消除vue的响应式代理
const toRaw: <T extends { __v_raw?: T }>(observed: T) => T = (observed) => {
  const raw = observed && observed['__v_raw'];
  return raw ? toRaw(raw) : observed;
};

async function hydrateStore(store: Store, { storage, key, debug, pick, omit, serializer, beforeHydrate, afterHydrate }: Persistence, context: PiniaPluginContext, runHooks = true) {
  try {
    if (runHooks) beforeHydrate?.(context);

    const fromStorage = await storage.getItem(key).catch((err: unknown) => consoleError(err, debug));

    if (fromStorage) {
      const picked = pick ? deepPickUnsafe(fromStorage, pick) : fromStorage;
      const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
      const data = serializer ? serializer.deserialize(omitted) : omitted;
      store.$patch(data);
    }

    if (runHooks) afterHydrate?.(context);
  } catch (error) {
    consoleError(error, debug);
  }
}

async function persistState(state: StateTree, { storage, key, debug, pick, omit, serializer }: Persistence) {
  try {
    const rawState = toRaw(state);
    const picked = pick ? deepPickUnsafe(rawState, pick) : rawState;
    const omitted = omit ? deepOmitUnsafe(picked, omit) : picked;
    const data = serializer ? serializer.serialize(omitted) : omitted;
    storage.setItem(key, data, (err: unknown) => {
      consoleError(err, debug);
    });
  } catch (error) {
    consoleError(error, debug);
  }
}

export function createPersistence(context: PiniaPluginContext, optionsParser: (p: PersistenceOptions) => Persistence, auto: boolean) {
  const {
    pinia,
    store,
    options: { persist = auto },
  } = context;
  // 为false则不持久化
  if (!persist) return;

  // Pinia热模块特殊处理
  if (!(store.$id in pinia.state.value)) {
    // @ts-expect-error `_s` is a stripped @internal
    const originalStore = (pinia._s as Map<string, StoreGeneric>).get(store.$id.replace('__hot:', ''));
    if (originalStore) void Promise.resolve().then(() => originalStore.$persist());
    return;
  }

  const persistenceOptions = Array.isArray(persist) ? persist : persist === true ? [{}] : [persist];

  const persistences = persistenceOptions.map(optionsParser);

  store.$hydrate = ({ runHooks = true } = {}) => {
    persistences.forEach((p) => {
      hydrateStore(store, p, context, runHooks);
    });
  };

  store.$persist = () => {
    persistences.forEach((p) => {
      persistState(store.$state, p);
    });
  };

  persistences.forEach(async (p) => {
    await hydrateStore(store, p, context);
    // 等待从持久化存储中还原数据到store完成后，开始订阅store的变更
    store.$subscribe((_mutation, state) => persistState(state, p), {
      detached: true,
    });
  });
}
