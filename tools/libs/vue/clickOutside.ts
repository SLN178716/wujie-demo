declare global {
  interface HTMLElement {
    clickOutsideEvent?: (e: Event) => unknown;
  }
}

export const ClickOutside = {
  beforeMount(el: HTMLElement, binding: (e: Event) => unknown) {
    el.clickOutsideEvent = (e: Event) => {
      if (!(el === e.target || el.contains(e.target as Node))) {
        binding(e);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent!);
  },
};
