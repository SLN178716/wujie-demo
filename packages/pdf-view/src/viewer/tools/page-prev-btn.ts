import { PdfBaseBtn } from './pdf-base-btn';

class PagePrevBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-shangye';
    this.eventName = 'page-prev';
    this.tooltip = '上页';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-page-prev-btn', PagePrevBtn);

export { PagePrevBtn };
