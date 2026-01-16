import { PdfBaseBtn } from './pdf-base-btn';

class ZoomDownBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-jianhao';
    this.eventName = 'zoom-down';
    this.tooltip = '缩小';
  }

  static styles = super.styles;
}

customElements.define('pdf-viewr-zoom-down-btn', ZoomDownBtn);

export { ZoomDownBtn };
