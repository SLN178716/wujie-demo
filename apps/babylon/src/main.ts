import { createApp } from 'vue';

import { vueTools } from 'tools';

import './style.css';
import App from './App.vue';
import router from './router';

let instance: ReturnType<typeof createApp>;
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    instance = createApp(App).use(router);
    instance.directive('resize', vueTools.vResize);
    instance.mount('#app');
  };
  window.__WUJIE_UNMOUNT = () => {
    instance.unmount();
  };
} else {
  instance = createApp(App);
  instance.directive('resize', vueTools.vResize);
  instance.use(router).mount('#app');
}
