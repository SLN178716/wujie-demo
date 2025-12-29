import { type DefineComponent, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';

const NotFound: DefineComponent = defineComponent({
  name: 'NotFound',
  setup() {
    const userStore = useUserStore();

    const { ttt } = storeToRefs(userStore);

    function base64ToBlob(base64: string, contentType = '') {
      if (!base64) return new Blob([]);
      const byteCharacters = atob(base64.split(',')[1] || ''); // 解码 Base64 数据
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      const byteArray = new Uint8Array(byteArrays);
      return new Blob([byteArray], { type: contentType });
    }

    const setValue = () => {
      ttt.value = base64ToBlob(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAOCAIAAACtuNvgAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAmUlEQVQokeWRIQ5DIQyGecsECASG9AAQkh4Eg+SsHIELcAEECcEhMMiJZ5Y3eMlmV9n0y/+1PRCRfF+PH5i/xADAew8A702llHPuDpNSzjlba7u0Y/k351wpRWu9w55LQ0ppzjmldJE0xoQQ1pKI2HsfY+yiFmkAIITovRNCOOfW2suA936Bfa4aYzxvs5VUSjHGaq03eme9AOxrLV2TwRFiAAAAAElFTkSuQmCC'
      );
    };

    return () => (
      <>
        <div>404</div>
        <button onClick={setValue} />
      </>
    );
  },
});

export default NotFound;
