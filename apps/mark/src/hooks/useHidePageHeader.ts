import { onMounted, onUnmounted } from 'vue';

export function useHidePageHeader() {
  onMounted(() => {
    window.$wujie?.bus.$emit("visiable-page-header", false);
  })
  onUnmounted(() => {
    window.$wujie?.bus.$emit("visiable-page-header", true);
  })
}