import { PdfBaseBtn } from './pdf-base-btn';

class ZoomUpBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-jiahao';
    this.eventName = 'zoom-up';
    this.tooltip = '放大';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-zoom-up-btn', ZoomUpBtn);

export { ZoomUpBtn };
