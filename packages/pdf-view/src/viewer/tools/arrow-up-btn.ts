import { PdfBaseBtn } from './pdf-base-btn';

class ArrowUpBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-shang';
    this.eventName = 'arrow-up';
    this.tooltip = '上一个';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-arrow-up-btn', ArrowUpBtn);

export { ArrowUpBtn };
