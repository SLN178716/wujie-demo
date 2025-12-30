import { defineStore } from 'pinia';
// import { localforage } from '@packages/pinia-plugin-persist';

// const storage = localforage.createInstance({
//   name: 'visual-display-storage',
//   storeName: 'user-store',
//   driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
// });

const useUserStore = defineStore('user', {
  state: () => ({
    menus: [],
    ttt: new Blob(),
  }),
  getters: {},
  actions: {
    setMenus() {},
  },
  persist: {
    key: 'user-store-persist',
    pick: ['ttt', 'menus'],
  },
});
export default useUserStore;
