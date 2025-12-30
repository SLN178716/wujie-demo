declare global {
  interface HTMLElement {
    clickOutsideEvent?: (e: Event) => unknown;
  }
}

export const VClickOutside = {
  beforeMount(el: HTMLElement, binding: { value: (e: Event) => unknown }) {
    el.clickOutsideEvent = (e: Event) => {
      if (!(el === e.target || el.contains(e.target as Node))) {
        if (typeof binding?.value === 'function') {
          binding.value(e);
        }
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent!);
  },
};
