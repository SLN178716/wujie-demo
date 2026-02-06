import { LitElement, type PropertyDeclarations, html, css, TemplateResult, unsafeCSS } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer.mjs';
import pdfStyle from 'pdfjs-dist/web/pdf_viewer.css?inline';

import { PdfParser } from '../parser/index';
import type { PdfInitOption, WatermarkOption } from '../types';
import { debounce } from '../utils';

import { PwdModal } from './pwd-modal';
import { PdfLoading } from './pdf-loading';
import { Virtualizer } from './virtualizer';
import { PaginationTool } from './tools';
import './virtualizer';
import './tools';
import { PDFPageProxy } from 'pdfjs-dist';

interface Metch {
  page: number;
  spanIdx: number;
  charBegin: number;
  charEnd: number;
  x: number;
  y: number;
}

class PdfSingleViewer extends LitElement {
  static properties: PropertyDeclarations = {
    customOnPassword: { attribute: 'custom-on-password', type: Boolean },
    customOnProgress: { attribute: 'custom-on-progress', type: Boolean },
    watermark: { type: Object },

    pages: { attribute: false, type: Array },
    itemHeight: { attribute: false, type: Number },
    metchs: { attribute: false, type: Array },
  };

  // 是否自定义OnPassword
  protected customOnPassword: boolean;
  // 是否自定义OnProgress
  protected customOnProgress: boolean;
  // 水印配置
  private watermark?: WatermarkOption;

  // 解析器
  private parser: PdfParser;
  // 输入密码框
  private pwdModal?: PwdModal | null;
  // 加载进度条
  private pdfLoading?: PdfLoading | null;
  private timer?: number;

  // 虚拟列表元素
  private virtual: Ref<Virtualizer<number>> = createRef();
  // 分页器元素
  private paginationRef: Ref<PaginationTool> = createRef();
  // 默认高度
  private itemHeight: number = 800;
  // 间隔
  private itemMargin: number = 10;

  // PDF页数数组
  private pages: Array<number>;
  // 缩放比例
  private scale: number = 1;
  // 旋转角度
  private rotation: number = 0;
  // 搜索匹配项信息
  private metchs: Metch[] = [];
  // 当前查看匹配项序号
  private currentMetch: number = 1;

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
    this.searchFind = debounce(this._search, 500);
  }

  disconnectedCallback() {
    this.parser?.reset();
    super.disconnectedCallback();
  }

  // 更新单个PDF高度数据
  private setItemHeight = (n: number) => {
    this.itemHeight = n;
  };
  // 异常处理方法
  private _dispatchError(err: unknown) {
    console.error(err);
    const errorEvent = new CustomEvent('on-error', {
      detail: err,
    });
    this.dispatchEvent(errorEvent);
  }

  // 密码hook
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

  // 进度hook
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

  // 渲染单页PDF
  private renderPdfPage(page: number): TemplateResult {
    const canvasRef: Ref<HTMLCanvasElement> = createRef();
    const divRef: Ref<HTMLDivElement> = createRef();
    this.parser.getPage(page).then(async (pdfPage) => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      // 设置 Canvas 尺寸
      const viewport = pdfPage.getViewport({ scale: this.scale, rotation: this.rotation });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await pdfPage
        .render({
          canvas: canvas,
          canvasContext: ctx,
          viewport: viewport,
        })
        .promise.catch((err) => {
          console.error(err);
        });

      // 创建水印图案
      if (this.watermark && this.watermark.text) {
        const { text, spacing: space, option } = this.watermark;
        const { fillStyle, font, textAlign, textBaseline } = Object.assign(
          {
            fillStyle: 'rgba(0, 0, 0, 0.2)',
            font: '16px Arial',
            textAlign: 'center',
            textBaseline: 'middle',
          },
          option || {}
        );
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.font = font;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.rotate(-Math.PI / 6);
        const spacing = space || text.length * 16;
        for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
          for (let y = -canvas.height; y < canvas.height * 2; y += spacing / 2) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      }

      // 创建文本图层
      const textLayer = new TextLayerBuilder({
        pdfPage,
      });
      await textLayer.render({
        viewport,
        textContentParams: { includeMarkedContent: true },
      });

      // 高亮搜索内容
      let curSpan = null;
      if (this.metchs?.length) {
        const spanList = textLayer.div.querySelectorAll('span');
        const markInfo = new Map<number, Array<{ charBegin: number; charEnd: number; idx: number }>>();
        for (let i = 0; i < this.metchs.length; i++) {
          const { page: p, spanIdx, charBegin, charEnd } = this.metchs[i];
          if (p !== page) continue;
          if (!markInfo.has(spanIdx)) {
            markInfo.set(spanIdx, []);
          }
          markInfo.get(spanIdx)!.push({ charBegin, charEnd, idx: i + 1 });
        }
        for (const [spanIdx, marks] of markInfo.entries()) {
          const span = spanList[spanIdx];
          const text = span.innerHTML;
          let s = '';
          let i = 0;
          for (const { charBegin, charEnd, idx } of marks) {
            if (!curSpan && idx === this.currentMetch) curSpan = span;
            s += `${text.substring(i, charBegin)}<mark ${idx === this.currentMetch ? 'style="background:#ff9304"' : ''}>${text.substring(charBegin, charEnd)}</mark>`;
            i = charEnd;
          }
          span.innerHTML = `${s}${text.substring(i, text.length)}`;
        }
      }

      if (divRef.value) {
        // 挂载文本内容
        divRef.value.replaceChildren(textLayer.div);
        if (curSpan) {
          // 将当前搜索目标滚动到视口中心
          curSpan.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
      }

      // 更新默认高度
      this.setItemHeight(canvas.height + this.itemMargin);
    });
    return html`
      <canvas class="pdf-canvas" ${ref(canvasRef)}></canvas>
      <div class="pdf-text" ${ref(divRef)} style="--total-scale-factor:${this.scale};"></div>
    `;
  }

  // 改变页码器页码
  private changePage(e: CustomEvent) {
    e.stopPropagation();
    const idx = e.detail || 1;
    this.paginationRef.value?.setCurrent(idx);
  }

  // 渲染PDF方法入口
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

  // 跳转至第X页
  changeCurrent(e: CustomEvent) {
    e.stopPropagation();
    const idx = ((e.detail as number) || 1) - 1;
    this.virtual.value?.scrollToIdx(idx);
  }

  // 关键字搜索（防抖）
  searchFind: (e: CustomEvent) => void;
  private async _search(e: CustomEvent) {
    e.stopPropagation();
    this.currentMetch = 1;
    if (!e.detail) {
      this.metchs = [];
      return;
    }
    // 获取所有PDFPageProxy
    const doc = this.parser.getDoc();
    if (!doc) return;
    const ppl = [];
    for (let i = 1; i <= doc.numPages; i++) {
      ppl.push(doc.getPage(i));
    }
    const ps = await Promise.all(ppl);
    // 获取所有TextContent
    type TextContent = ReturnType<PDFPageProxy['getTextContent']>;
    const tpl = ps.reduce((rtv, itm) => {
      rtv.push(itm.getTextContent());
      return rtv;
    }, [] as TextContent[]);
    const tcs = await Promise.all(tpl);
    // 遍历匹配
    const metchs: Metch[] = [];
    const s = e.detail as string;
    for (let i = 0; i < tcs.length; i++) {
      const items = tcs[i].items;
      for (let j = 0, k = 0; j < items.length; j++) {
        if ('str' in items[j]) {
          const str = (items[j] as any).str as string;
          if (str) {
            let idx = str.indexOf(s);
            while (idx !== -1) {
              const transform = (items[j] as any).transform as number[];
              metchs.push({
                page: i + 1,
                spanIdx: k,
                charBegin: idx,
                charEnd: idx + s.length,
                x: transform[4],
                y: transform[5],
              });
              idx = str.indexOf(s, idx + 1);
            }
            k += 1;
          }
        }
      }
    }
    // 根据页数>Y>X的顺序自上而下自左而右整理匹配项顺序
    this.metchs = metchs.sort((a, b) => {
      if (a.page !== b.page) return a.page - b.page;
      if (a.y !== b.y) return b.y - a.y;
      return a.x - b.x;
    });
    this.searchSwitch(new CustomEvent('', { detail: 1 }));
  }
  // 关键字搜索上下条切换
  searchSwitch(e: CustomEvent) {
    e.stopPropagation();
    this.currentMetch = e.detail as number;
    const page = this.metchs[this.currentMetch - 1]?.page;
    if (page && !this.virtual.value?.isRender(page - 1)) {
      this.virtual.value?.scrollToIdx(page - 1);
    } else {
      this.virtual.value?.reRender();
    }
  }

  zoomUp(e: CustomEvent) {
    e.stopPropagation();
    this.scale += 0.2;
    this.virtual.value?.reRender();
  }

  zoomDown(e: CustomEvent) {
    e.stopPropagation();
    this.scale -= 0.2;
    this.virtual.value?.reRender();
  }

  rotate(e: CustomEvent) {
    e.stopPropagation();
    this.rotation = (this.rotation + 90) % 360;
    this.virtual.value?.reRender();
  }

  download(e: CustomEvent) {
    e.stopPropagation();
    const doc = this.parser.getDoc();
    if (!doc) return;
    doc.getData().then((res) => {
      const blob = new Blob([res as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '预览文件.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  render() {
    return html`<div
      part="container"
      class="component-container"
      @zoom-up="${this.zoomUp}"
      @zoom-down="${this.zoomDown}"
      @page-change="${this.changeCurrent}"
      @rotate="${this.rotate}"
      @download="${this.download}"
      @search-find="${this.searchFind}"
      @search-switch="${this.searchSwitch}">
      <div part="tools" class="tools-container">
        <pdf-view-zoom-down-btn></pdf-view-zoom-down-btn>
        <pdf-view-zoom-up-btn></pdf-view-zoom-up-btn>
        <pdf-view-pagination-tool ${ref(this.paginationRef)} total="${this.pages.length}"></pdf-view-pagination-tool>
        <pdf-view-rotate-btn></pdf-view-rotate-btn>
        <pdf-view-search-tool .metchs=${this.metchs}></pdf-view-search-tool>
        <pdf-view-download-btn></pdf-view-download-btn>
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

  static styles = [
    unsafeCSS(pdfStyle),
    css`
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
        display: block;
        height: calc(100% - var(--tools-btn-size) - 2 * var(--context-padding-y));
        background-color: var(--context-bg-color);
      }
      .component-container > .context-container .viewport {
        padding: var(--context-padding-y) var(--context-padding-x);
      }
      .component-container > .context-container .pdf-canvas {
        display: block;
        margin-bottom: var(--item-margin);
      }
      .component-container > .context-container .pdf-text {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        --scale-round-y: 0.01px;
        --scale-round-x: 0.01px;
      }
      .component-container > .custom-container {
        position: absolute;
        top: 0%;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    `,
  ];
}

export { PdfSingleViewer };
