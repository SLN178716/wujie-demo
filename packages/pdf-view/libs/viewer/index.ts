import { LitElement, type PropertyDeclarations, html, css } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

import { PdfParser } from '../parser/index';
import type { PdfInitOption } from '../../types';

import { PwdModal } from './pwd-modal';
import { PdfLoading } from './pdf-loading';

customElements.define('pdf-viewr-pwd-modal', PwdModal);
customElements.define('pdf-viewr-loading', PdfLoading);

class PdfViewer extends LitElement {
  static properties: PropertyDeclarations = {
    customOnPassword: { attribute: 'custom-on-password', type: Boolean },
    customOnProgress: { attribute: 'custom-on-progress', type: Boolean },
  };

  // 是否自定义OnPassword
  protected customOnPassword: boolean;
  // 是否自定义OnProgress
  protected customOnProgress: boolean;

  private parser: PdfParser;
  private canvasRef: Ref<HTMLCanvasElement> = createRef();
  private pwdModal?: PwdModal | null;
  private pdfLoading?: PdfLoading | null;

  constructor() {
    super();
    this.customOnPassword = false;
    this.customOnProgress = false;
    this.parser = PdfParser.create({
      errorCallback: (err) => {
        return Promise.reject(err);
      },
    });
    this.parser.interceptor.afterTaskInit.use((task) => {
      task.onPassword = this._onPassword.bind(this);
      task.onProgress = this._onProgress.bind(this);
      return task;
    });
    this.parser.interceptor.afterDocInit.use(
      async (doc) => {
        const pdfPage = await doc.getPage(1);
        const canvas = this.canvasRef.value!;
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
        return doc;
      },
      (err) => {
        if (this.pdfLoading) {
          this.pdfLoading.destory();
          this.pdfLoading = null;
        }
        this._dispatchError(err);
      }
    );
  }

  private _dispatchError(err: unknown) {
    console.error(err);
    const errorEvent = new CustomEvent('on-error', {
      detail: err,
    });
    this.dispatchEvent(errorEvent);
  }

  private _onPassword(updateCallback: (pwd: string) => void, reason: string) {
    if (this.customOnPassword) {
      this.dispatchEvent(new CustomEvent('on-password', { detail: { updateCallback, reason } }));
      return;
    }
    const opt = {
      rootEle: document.body,
      title: '',
      content: '',
      confirm: updateCallback,
      cancel: () => {
        this.parser.getTask()?.destroy();
        this.parser.reset();
      },
    };
    if (this.pwdModal) {
      opt.title = '密码错误';
      opt.content = '请重新输入正确密码以打开文件。';
      this.pwdModal.show(opt);
    } else {
      opt.title = '请输入密码';
      opt.content = '此文件受密码保护。请输入密码以打开文件。';
      this.pwdModal = PwdModal.show(opt);
    }
  }

  private _onProgress({ loaded, total }: { loaded: number; total: number }) {
    if (this.customOnProgress) {
      this.dispatchEvent(new CustomEvent('on-password', { detail: { loaded, total } }));
      return;
    }
    if (!this.pdfLoading) {
      this.pdfLoading = PdfLoading.create({
        rootEle: document.body,
      });
    }
    this.pdfLoading.showThrottle(total === 0 ? 0 : (loaded / total) * 100);
    if (loaded === total) {
      setTimeout(() => {
        this.pdfLoading?.destory();
        this.pdfLoading = null;
      }, 1000);
    }
    console.log(loaded, total);
  }

  show(opt: PdfInitOption) {
    this.pwdModal?.destory();
    this.pwdModal = null;
    this.parser.parse(opt);
  }

  render() {
    return html`<div part="container" class="component-container">
      <div part="tools" class="tools-container"></div>
      <div part="context" class="context-container">
        <canvas ${ref(this.canvasRef)} part="canvas" class="canvas"></canvas>
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
