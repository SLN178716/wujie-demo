import { PdfBaseBtn } from './pdf-base-btn';

class PageNextBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-xiaye';
    this.eventName = 'page-next';
    this.tooltip = '下页';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-page-next-btn', PageNextBtn);

export { PageNextBtn };
