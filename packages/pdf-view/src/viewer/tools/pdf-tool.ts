import { LitElement, type PropertyDeclarations, html, css } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

import { throttle } from '../../utils';

class PdfTool extends LitElement {
  static properties: PropertyDeclarations = {
    tooltip: { type: String },
    mouseIn: { attribute: false, type: Boolean, state: true },
  };

  protected tooltip: string;
  private mouseIn: boolean;
  private position: string;
  private intersectionObserver: IntersectionObserver;
  private tooltipRef: Ref<HTMLDivElement> = createRef();
  private mouseMoveThrottle: (e: MouseEvent) => void;

  constructor() {
    super();
    this.tooltip = '';
    this.mouseIn = false;
    this.position = '';
    this.mouseMoveThrottle = throttle(this.mouseMove, 50);
    this.intersectionObserver = new IntersectionObserver((eles) => {
      for (let i = 0; i < eles.length; i++) {
        // 比例为0表示提示框隐藏了
        if (eles[i].intersectionRatio === 0) {
          this.position = '';
          continue;
        } else if (eles[i].intersectionRatio < 1) {
          const { right: b_right, bottom: b_bottom } = eles[i].boundingClientRect;
          const { right: i_right, bottom: i_bottom } = eles[i].intersectionRect;
          const px = b_right > i_right ? 'l' : 'r';
          const py = b_bottom > i_bottom ? 't' : 'b';
          this.position = px + py;
        }
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      this.intersectionObserver.observe(this.tooltipRef.value!);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.intersectionObserver.disconnect();
  }

  private mouseMove(e: MouseEvent) {
    e.preventDefault();
    const { pageX: x, pageY: y } = e;
    let style = '';
    switch (this.position) {
      case 'lt':
        style = `right: calc(100vw - ${x}px + 10px);bottom: calc(100vh - ${y}px)`;
        break;
      case 'lb':
        style = `right: calc(100vw - ${x}px + 10px);top: ${y}px`;
        break;
      case 'rt':
        style = `left: ${x + 10}px;bottom: calc(100vh - ${y}px)`;
        break;
      case 'rb':
      default:
        style = `left: ${x + 10}px;top: ${y}px`;
    }
    this.tooltipRef.value!.style = style;
  }

  render() {
    return html`<div class="tool-container" @mouseenter="${() => (this.mouseIn = true)}" @mouseleave="${() => (this.mouseIn = false)}" @mousemove="${this.mouseMoveThrottle}">
      <div ${ref(this.tooltipRef)} class="tooltip ${this.mouseIn ? '' : 'hide'}">${this.tooltip}</div>
      <slot></slot>
    </div>`;
  }

  static styles = css`
    :host {
      pointer-events: auto;
      display: block;
    }
    .tool-container {
      width: 100%;
      height: 100%;
    }
    .tooltip {
      max-width: 30vw;
      position: fixed;
      background: #333333;
      border: 1px solid #666666;
      display: block;
      color: #fff;
      padding: 5px;
      line-height: 1.2;
      font-size: small;
      z-index: 999;
    }
    .tooltip.hide {
      display: none;
    }
  `;
}

customElements.define('pdf-viewr-tool', PdfTool);

const defBtnCss = [
  css`
    .iconfont {
      font-family: 'alicon' !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .icon-jianhao:before {
      content: '\\e729';
    }

    .icon-jiahao:before {
      content: '\\eaf3';
    }

    .icon-shangye:before {
      content: '\\e634';
    }

    .icon-xiaye:before {
      content: '\\e638';
    }

    .icon-liangbiankuozhan:before {
      content: '\\e90b';
    }
  `,
  css`
    .btn-container {
      width: var(--tools-btn-size);
      height: var(--tools-btn-size);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
];
export { PdfTool, defBtnCss };
