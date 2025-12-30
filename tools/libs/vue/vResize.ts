declare global {
  interface HTMLElement {
    resizeObserver?: ResizeObserver | undefined;
  }
}

export const vResize = {
  mounted(el: HTMLElement, binding: { value: (entries: ResizeObserverEntry[]) => unknown }) {
    const { value } = binding;
    if (!value || typeof value !== 'function') return;
    el.resizeObserver = new ResizeObserver(value);
    el.resizeObserver.observe(el);
  },
  unmounted(el: HTMLElement) {
    el.resizeObserver?.disconnect();
    el.resizeObserver = undefined;
  },
};
