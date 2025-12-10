import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './App.vue';
import router from './router';

if (window.__POWERED_BY_WUJIE__) {
  let instance: ReturnType<typeof createApp>;
  window.__WUJIE_MOUNT = () => {
    instance = createApp(App);
    instance.use(router);
    instance.use(ElementPlus);
    instance.mount('#app');
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  createApp(App).use(router).mount('#app');
}
