import { LitElement, type PropertyDeclarations, html, css } from 'lit';

export interface PdfLoadingInitOption {
  showMask?: boolean;
  radius?: number;
  visible?: boolean;
  throttleTime?: number;
}

export type ShowPdfLoadingOption = {
  rootEle: HTMLElement;
} & PdfLoadingInitOption;

function throttle(func: Function, wait: number) {
  let lastTime = 0;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}
class PdfLoading extends LitElement {
  static properties: PropertyDeclarations = {
    visible: { type: Boolean },
    radius: { type: Number },
    percent: { type: Number },
    throttleTime: { type: Number, attribute: 'throttle-time' },
    showMask: { type: Boolean, attribute: 'show-mask' },
  };

  protected percent: number;
  protected showMask: boolean;
  protected radius: number;
  protected visible: boolean;
  protected throttleTime: number;

  public showThrottle: (p: number) => void;

  constructor({ showMask, radius, visible, throttleTime }: PdfLoadingInitOption) {
    super();
    this.percent = 0;
    this.showMask = showMask ?? true;
    this.radius = radius || 50;
    this.visible = visible ?? false;
    this.throttleTime = throttleTime || 100;
    this.showThrottle = throttle(this.show, this.throttleTime);
  }

  private _getStrokeDashOffset(percent: number) {
    let n = percent;
    if (n < 0) n = 0;
    if (n > 100) n = 100;
    const offset = (2 * Math.PI * this.radius * (100 - n)) / 100;
    return offset.toFixed(2);
  }

  static create({ rootEle, showMask, radius, visible, throttleTime }: ShowPdfLoadingOption) {
    const pdfLoding = new PdfLoading({ showMask, radius, visible, throttleTime });
    rootEle.appendChild(pdfLoding);
    return pdfLoding;
  }

  show(percent?: number) {
    if (percent != null) this.percent = percent;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  destory() {
    this.parentNode?.removeChild(this);
  }

  render() {
    return html`<div class="pdf-loading-mask ${this.visible ? '' : 'hide'} ${this.showMask ? 'show-mask' : ''}">
      <div class="pdf-loading-container">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="${this.radius}" fill="none" stroke="#eee" stroke-width="10" />
          <circle
            class="process"
            cx="60"
            cy="60"
            r="${this.radius}"
            fill="none"
            stroke="#006cbe"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="${this._getStrokeDashOffset(0)}"
            stroke-dashoffset="${this._getStrokeDashOffset(this.percent)}" />
        </svg>
        <div class="text">${this.percent?.toFixed(2) || 0}%</div>
      </div>
    </div>`;
  }

  static styles = css`
    .pdf-loading-mask {
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      background-color: transparent;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pdf-loading-mask.hide {
      display: none;
    }
    .pdf-loading-mask.show-mask {
      pointer-events: auto;
      background-color: #6a6a6af1;
    }
    .pdf-loading-container {
      background-color: #333333;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 150px;
      position: relative;
    }
    .process {
      transition: stroke-dashoffset 0.5s ease;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
    .text {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      color: #fff;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
}

export { PdfLoading };
