import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';

import { createPersistedState } from '@packages/pinia-plugin-persist';

import './style.css';
import App from './App.vue';
import router from './router';

const pinia = createPinia();
pinia.use(
  createPersistedState({
    debug: import.meta.env.DEV,
  })
);

if (window.__POWERED_BY_WUJIE__) {
  let instance: ReturnType<typeof createApp>;
  window.__WUJIE_MOUNT = () => {
    instance = createApp(App).use(router).use(ElementPlus).use(pinia);
    instance.mount('#app');
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  createApp(App).use(router).use(ElementPlus).use(pinia).mount('#app');
}
