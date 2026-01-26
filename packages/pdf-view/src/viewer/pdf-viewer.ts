import { LitElement, type PropertyDeclarations, html, css, TemplateResult } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { getUuid } from 'pdfjs-dist';

import { PdfParser } from '../parser/index';
import type { PdfInitOption } from '../types';
import { debounce } from '../utils';

import { PwdModal } from './pwd-modal';
import { PdfLoading } from './pdf-loading';
import './virtualizer';
import './tools';
import { Virtualizer } from './virtualizer';
import { PaginationTool } from './tools';

class PdfViewer extends LitElement {
  static properties: PropertyDeclarations = {
    customOnPassword: { attribute: 'custom-on-password', type: Boolean },
    customOnProgress: { attribute: 'custom-on-progress', type: Boolean },
    pages: { attribute: false, type: Array },
    itemHeight: { attribute: false, type: Number },
  };

  // 是否自定义OnPassword
  protected customOnPassword: boolean;
  // 是否自定义OnProgress
  protected customOnProgress: boolean;

  private parser: PdfParser;
  private pwdModal?: PwdModal | null;
  private pdfLoading?: PdfLoading | null;
  private timer?: number;
  private pages: Array<number>;

  private scale: number = 1;
  private rotation: number = 0;
  private itemHeight: number = 800;
  private itemMargin: number = 10;
  private setItemHeight = (n: number) => {
    this.itemHeight = n;
  };
  private virtual: Ref<Virtualizer<number>> = createRef();
  private paginationRef: Ref<PaginationTool> = createRef();

  constructor() {
    super();
    this.customOnPassword = false;
    this.customOnProgress = false;
    this.parser = PdfParser.create();
    this.pages = [];
    this.parser.interceptor.afterTaskInit.use((task) => {
      task.onPassword = this._onPassword.bind(this);
      task.onProgress = this._onProgress.bind(this);
      return task;
    });
    this.parser.interceptor.afterDocInit.use(
      async (doc) => {
        this.pages = Array.from({ length: doc.numPages }, (_, x) => x + 1);
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
    this.setItemHeight = debounce(this.setItemHeight, 50);
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
    if (loaded >= total && !this.pdfLoading) return;
    if (!this.pdfLoading) {
      this.pdfLoading = PdfLoading.create({
        rootEle: document.body,
      });
    }
    if (loaded >= total) {
      if (!this.timer) {
        this.pdfLoading.show(100);
        this.timer = setTimeout(() => {
          this.timer = void 0;
          this.pdfLoading?.destory();
          this.pdfLoading = null;
        }, 1000);
      }
    } else {
      this.pdfLoading.showThrottle(total === 0 ? 0 : (loaded / total) * 100);
    }
  }

  private renderPdfPage(page: number): TemplateResult {
    const canvasRef: Ref<HTMLCanvasElement> = createRef();
    const uuid = getUuid().replace(/-/g, '');
    this.parser.getPage(page).then(async (pdfPage) => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // 设置 Canvas 尺寸
      const viewport = pdfPage.getViewport({ scale: this.scale, rotation: this.rotation });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pdfPage
        .render({
          canvas: canvas,
          canvasContext: ctx as CanvasRenderingContext2D | undefined,
          viewport: viewport,
        })
        .promise.catch((err) => {
          console.error(err);
        });

      this.setItemHeight(canvas.height + this.itemMargin);
    });
    return html`<canvas id="${uuid}" style="display: block;margin-bottom:var(--item-margin);" ${ref(canvasRef)}></canvas>`;
  }

  private changeCurrent({ detail }: { detail: number }) {
    const idx = (detail || 1) - 1;
    this.virtual.value?.scrollToIdx(idx);
  }

  private changePage({ detail }: { detail: number }) {
    const idx = detail || 1;
    this.paginationRef.value?.setCurrent(idx);
  }

  show(opt: PdfInitOption) {
    this.pwdModal?.destory();
    this.pwdModal = null;
    this.pdfLoading?.destory();
    this.pdfLoading = null;
    this.pages = [];
    this.scale = 1;
    this.rotation = 0;
    this.parser.parse(opt);
  }

  zoomUp(e: Event) {
    e.stopPropagation();
    this.scale += 0.2;
    this.virtual.value?.reRender();
  }

  zoomDown(e: Event) {
    e.stopPropagation();
    this.scale -= 0.2;
    this.virtual.value?.reRender();
  }

  rotate(e: Event) {
    e.stopPropagation();
    this.rotation = (this.rotation + 90) % 360;
    this.virtual.value?.reRender();
  }

  disconnectedCallback() {
    this.parser?.reset();
    super.disconnectedCallback();
  }

  render() {
    return html`<div
      part="container"
      class="component-container"
      @zoom-up="${this.zoomUp}"
      @zoom-down="${this.zoomDown}"
      @page-change="${this.changeCurrent}"
      @rotate="${this.rotate}">
      <div part="tools" class="tools-container">
        <pdf-view-zoom-down-btn></pdf-view-zoom-down-btn>
        <pdf-view-zoom-up-btn></pdf-view-zoom-up-btn>
        <pdf-view-pagination-tool ${ref(this.paginationRef)} total="${this.pages.length}"></pdf-view-pagination-tool>
        <pdf-view-rotate-btn></pdf-view-rotate-btn>
      </div>
      <pdf-view-virtualizer
        ${ref(this.virtual)}
        part="context"
        class="context-container"
        style="--item-height: ${this.itemHeight}px; --item-margin: ${this.itemMargin}px"
        .data=${this.pages}
        default-height="${this.itemHeight}"
        .renderItem=${(page: number) => this.renderPdfPage(page)}
        @current-change="${this.changePage}"></pdf-view-virtualizer>
      <div class="custom-container">
        <slot></slot>
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
      position: relative;
    }

    .component-container > .tools-container {
      width: 100%;
      height: var(--tools-btn-size);
      background-color: var(--tools-bg-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .component-container > .context-container {
      height: calc(100% - var(--tools-btn-size) - 2 * var(--context-padding-y));
      background-color: var(--context-bg-color);
    }
    .component-container > .context-container::part(viewport) {
      padding: var(--context-padding-y) var(--context-padding-x);
    }
    .component-container > .context-container > .scroll-list {
      height: 100%;
    }
    .component-container > .custom-container {
      position: absolute;
      top: 0%;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `;
}

export { PdfViewer };
