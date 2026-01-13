export function createVPermission<T>(hasPermission: (value: T[]) => boolean) {
  return {
    beforeMount(el: HTMLElement, binding: { value: Array<T> }) {
      const { value } = binding;
      if (value && Array.isArray(value) && value.length && !hasPermission(value)) {
        el.parentNode?.removeChild(el);
      }
    },
  };
}
