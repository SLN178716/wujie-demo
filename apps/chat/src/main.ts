import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { routes } from './router'

if (window.__POWERED_BY_WUJIE__) {
  let instance: ReturnType<typeof createApp>;
  window.__WUJIE_MOUNT = () => {
    const router = createRouter({ history: createWebHistory(), routes });
    instance = createApp(App);
    instance.use(router);
    instance.mount("#app");
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  createApp(App).use(createRouter({ history: createWebHistory(), routes })).mount("#app");
}

