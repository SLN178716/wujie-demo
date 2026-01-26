import { PdfBaseBtn } from './pdf-base-btn';

class RotateBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-rotate';
    this.eventName = 'rotate';
    this.tooltip = '旋转';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-rotate-btn', RotateBtn);

export { RotateBtn };
