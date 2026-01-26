import { PdfBaseBtn } from './pdf-base-btn';

class DownloadBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-xiazai';
    this.eventName = 'download';
    this.tooltip = '下载';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-download-btn', DownloadBtn);

export { DownloadBtn };
