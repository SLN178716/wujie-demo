import { LitElement, type PropertyDeclarations, html, css } from 'lit';

import { createPdfParser, PdfParser } from '../parser';
import { ErrorEnums } from '../../types';
import type { PdfInitOption, ErrorType } from '../../types';

class PdfViewer extends LitElement {
  static properties: PropertyDeclarations = {};

  private parser?: PdfParser;
  constructor() {
    super();
  }

  private _dispatchError(err: ErrorType) {
    const errorEvent = new CustomEvent('error', {
      detail: err,
    });
    this.dispatchEvent(errorEvent);
  }

  show(opt: PdfInitOption) {
    createPdfParser(opt)
      .then((res) => (this.parser = res))
      .then(async (parser) => {
        const pdfDoc = await parser.getDoc();
        if (!pdfDoc) {
          this._dispatchError(ErrorEnums.PDF_LOAD_FAIL);
          return;
        }
        const pdfPage = await pdfDoc.getPage(1);
        const canvas = this.shadowRoot!.querySelector('#canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        // 设置 Canvas 尺寸
        const viewport = pdfPage.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // 渲染页面
        await pdfPage.render({
          canvas: canvas,
          canvasContext: ctx as CanvasRenderingContext2D | undefined,
          viewport: viewport,
        }).promise;
      });
  }

  render() {
    return html`<div part="container" class="component-container">
      <div part="tools" class="tools-container"></div>
      <div part="context" class="context-container">
        <canvas id="canvas" part="canvas" class="canvas"></canvas>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      --tools-btn-size: 40px;
      --tools-bg-color: #333333;
      --context-bg-color: #f2f2f2;
      --context-padding-x: 10px;
      --context-padding-y: 10px;
    }
    .component-container {
      width: 100%;
      height: 100%;
    }
    .component-container > .tools-container {
      width: 100%;
      height: var(--tools-btn-size);
      background-color: var(--tools-bg-color);
    }
    .component-container > .context-container {
      height: calc(100% - var(--tools-btn-size) - 2 * var(--context-padding-y));
      background-color: var(--context-bg-color);
      padding: var(--context-padding-y) var(--context-padding-x);
      overflow: scroll;
    }
  `;
}

export { PdfViewer };
