import localforage from 'localforage';

const defStorage = localforage.createInstance({
  name: 'pinia-plugin-persist-default-storage',
  storeName: 'pinia-plugin-persist-default-store',
  driver: localforage.LOCALSTORAGE,
});

export default defStorage;

export { localforage };
