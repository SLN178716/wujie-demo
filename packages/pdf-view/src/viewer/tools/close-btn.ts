import { PdfBaseBtn } from './pdf-base-btn';

class CloseBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-guanbi';
    this.eventName = 'close';
    this.tooltip = '关闭';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-close-btn', CloseBtn);

export { CloseBtn };
