import { LitElement, type PropertyDeclarations, html } from 'lit';
import { defBtnCss } from './pdf-tool';

class ZoomDownBtn extends LitElement {
  static properties: PropertyDeclarations = {};

  constructor() {
    super();
  }

  render() {
    return html`<pdf-viewr-tool class="btn-container" tooltip="缩小">
      <i class="alicon icon-jianhao"></i>
    </pdf-viewr-tool>`;
  }

  static styles = [...defBtnCss];
}

customElements.define('pdf-viewr-zoom-down-btn', ZoomDownBtn);

export { ZoomDownBtn };
