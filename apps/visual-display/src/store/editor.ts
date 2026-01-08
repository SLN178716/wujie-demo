import { defineStore } from 'pinia';

const useEditorStore = defineStore('editor', {
  state: () => ({
    canvasWidth: 1920,
    canvasHeight: 1080,
  }),
  getters: {},
  actions: {
    setCanvasWidth(num: number) {
      if (num <= 0) return;
      this.canvasWidth = num;
    },
    setCanvasHeight(num: number) {
      if (num <= 0) return;
      this.canvasHeight = num;
    },
  },
});

export default useEditorStore;
