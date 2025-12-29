import type { PiniaPluginContext, StateTree } from 'pinia';
import type { Path } from 'deep-pick-omit';
import localforage from 'localforage';

export type PluginOptions = Pick<PersistenceOptions, 'storage' | 'debug' | 'serializer'> & {
  key?: (storeKey: string) => string;
  auto?: boolean;
};

export interface Serializer {
  serialize: (data: StateTree) => unknown;
  deserialize: (data: unknown) => StateTree;
}
export interface Persistence<State extends StateTree = StateTree> {
  key: string;
  debug: boolean;
  storage: typeof localforage;
  serializer?: Serializer;
  beforeHydrate?: (context: PiniaPluginContext) => void;
  afterHydrate?: (context: PiniaPluginContext) => void;
  pick?: Path<State>[] | string[];
  omit?: Path<State>[] | string[];
}

export type PersistenceOptions<State extends StateTree = StateTree> = Partial<Persistence<State>>;

export type Persist<State extends StateTree = StateTree> = boolean | PersistenceOptions<State> | PersistenceOptions<State>[];

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: Persist<S>;
  }

  export interface PiniaCustomProperties {
    /**
     * 手动触发从持久化存储向store同步
     * @param opts.runHooks 是否触发前后置钩子方法
     * @returns
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void;
    /**
     * 手动触发将store数据写入持久化存储
     * @returns
     */
    $persist: () => void;
  }
}
