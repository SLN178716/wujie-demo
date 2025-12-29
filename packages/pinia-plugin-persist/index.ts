import type { PiniaPluginContext } from 'pinia';

import type { PluginOptions } from './types.ts';
import { createPersistence } from './lib/core';
import defStorage, { localforage } from './lib/storages';

export function createPersistedState(options: PluginOptions = {}) {
  return function (context: PiniaPluginContext) {
    createPersistence(
      context,
      (p) => ({
        key: (options.key ? options.key : (x: string) => x)(p.key ?? context.store.$id),
        debug: p.debug ?? options.debug ?? false,
        serializer: p.serializer ?? options.serializer,
        storage: p.storage ?? options.storage ?? defStorage,
        beforeHydrate: p.beforeHydrate,
        afterHydrate: p.afterHydrate,
        pick: p.pick,
        omit: p.omit,
      }),
      options.auto ?? false
    );
  };
}

export { localforage };
