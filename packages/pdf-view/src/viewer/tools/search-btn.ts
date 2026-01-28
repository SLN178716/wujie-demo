import { PdfBaseBtn } from './pdf-base-btn';

class SearchBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-sousuo';
    this.eventName = 'search';
    this.tooltip = '搜索';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-search-btn', SearchBtn);

export { SearchBtn };
