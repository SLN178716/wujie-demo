import { PdfBaseBtn } from './pdf-base-btn';

class DragBtn extends PdfBaseBtn {
  constructor() {
    super();
    this.icon = 'icon-tuozhuai';
    this.eventName = 'drag';
    this.tooltip = '拖拽';
  }

  static styles = super.styles;
}

customElements.define('pdf-view-drag-btn', DragBtn);

export { DragBtn };
