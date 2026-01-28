import { PdfBaseBtn } from './pdf-base-btn';

class ArrowDownBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-xia';
    this.eventName = 'arrow-down';
    this.tooltip = '下一个';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-arrow-down-btn', ArrowDownBtn);

export { ArrowDownBtn };
