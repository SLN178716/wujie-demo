import { LitElement, type PropertyDeclarations, html } from 'lit';
import { defBtnCss } from './pdf-tool';

class PdfBaseBtn extends LitElement {
  static properties: PropertyDeclarations = {
    icon: { type: String },
    eventName: { type: String },
    tooltip: { type: String },
  };

  protected icon: string;
  protected eventName: string;
  protected tooltip: string;

  constructor() {
    super();
    this.icon = '';
    this.eventName = '';
    this.tooltip = '';
  }

  click() {
    if (!this.eventName) return;
    this.dispatchEvent(new CustomEvent(this.eventName, { bubbles: true, composed: true }));
  }

  render() {
    return html`<pdf-view-tool class="btn-container" tooltip="${this.tooltip}" @click="${this.click}">
      <slot>
        <i class="alicon ${this.icon}"></i>
      </slot>
    </pdf-view-tool>`;
  }

  static styles = [...defBtnCss];
}

customElements.define('pdf-view-pdf-base-btn', PdfBaseBtn);

export { PdfBaseBtn };
