import { css, html, LitElement, PropertyDeclarations, PropertyValues, TemplateResult } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import { type KeyFn, repeat } from 'lit/directives/repeat.js';

import { debounce } from '../../utils';

class Virtualizer<T> extends LitElement {
  static properties: PropertyDeclarations = {
    data: { type: Array },
    renderItem: {
      type: Function,
      hasChanged(v, ov) {
        return v !== ov;
      },
    },
    keyFunc: {
      type: Function,
      hasChanged(v, ov) {
        return v !== ov;
      },
    },
    defaultHeight: { attribute: 'default-height', type: Number },
    buffer: { type: Number },
    visibleRange: {
      attribute: false,
      type: Array,
      hasChanged(v: [number, number], ov: [number, number]) {
        if (ov == null) return true;
        return v[0] < ov[0] || v[1] > ov[1];
      },
    },
    version: { attribute: false, type: Number },
  };

  protected data: T[] = []; // 数据列表
  protected renderItem: (item: T, idx: number) => TemplateResult = (item, idx) => html`${idx}: ${JSON.stringify(item)}`; // 单项内容渲染函数
  protected keyFunc: KeyFn<T> = (item) => item; // key生产方法
  protected defaultHeight: number = 100; // 默认高度
  protected buffer: number = 2; // 前后缓冲的项数

  protected visibleRange: [number, number] = [-1, -1]; // 渲染范围
  protected version: number = 0;

  private viewportObserver: ResizeObserver; // 视口变化观察器
  private itemObserver: ResizeObserver; // 各项内容大小变化观察期
  private cachedHeights: Array<number | undefined> = []; // 高度缓存数组
  private viewportHeight: number = 0; // 视口高度
  private scrollTopNum: number = 0; // 滚动高度
  private scrollContainerRef: Ref<HTMLDivElement> = createRef(); // 滚动容器
  private calculateTotalHeightDebounce: () => void; // 重新计算总高度(防抖)
  private calculateVisibleRangeDebounce: () => void; // 重新计算可视范围(防抖)
  private viewportRef: Ref<HTMLDivElement> = createRef();
  private itemMaxWidth: number = 0;

  public reRender: () => void;
  public scrollToIdx(idx: number) {
    let i = idx;
    if (idx < 0) i = 0;
    if (idx >= this.data.length) i = this.data.length - 1;
    let t = 0;
    for (let j = 0; j < i; j++) {
      t += this.cachedHeights[j] || this.defaultHeight;
    }
    this.viewportRef.value?.scrollTo({ top: t });
  }

  constructor() {
    super();
    this.viewportObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === this) {
          // 视口大小变化重新，重新计算可视范围
          this.viewportHeight = entry.contentRect.height;
          this.calculateVisibleRangeDebounce();
        }
      }
    });
    this.itemObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const div = entry.target as HTMLElement;
        if (div.dataset['idx']) {
          // 各元素大小变化后，缓存其高度
          this.cachedHeights[Number(div.dataset['idx'])] = entry.contentRect.height;
        }
        if (this.scrollContainerRef.value) {
          this.itemMaxWidth = Math.max(this.itemMaxWidth, entry.contentRect.width);
          this.scrollContainerRef.value.style.width = `${this.itemMaxWidth}px`;
        }
      }
      // 重新计算可视范围
      this.calculateTotalHeightDebounce();
    });
    this.calculateTotalHeightDebounce = debounce(this._calculateTotalHeight, 50);
    this.calculateVisibleRangeDebounce = debounce(this._calculateVisibleRange, 20);
    this.reRender = debounce(this._reRender, 100);
  }

  protected willUpdate(changedMap: PropertyValues) {
    console.table(
      `will update =============> \n${Array.from(changedMap)
        .map(([k, v]: [PropertyKey, unknown]) => `${String(k)}: ${JSON.stringify(v)} => ${JSON.stringify(this[k as keyof this])}`)
        .join('\n')}`
    );
    // 数据变化时清空原有高度缓存
    if (changedMap.has('data') || changedMap.has('version')) {
      this.cachedHeights = [];
      this.itemMaxWidth = 0;
    }
    // 数据变化或缓冲数量变化时重新计算渲染范围
    if (changedMap.has('data') || changedMap.has('buffer') || changedMap.has('version')) {
      this.calculateVisibleRangeDebounce();
    }
    // 数据和默认高度变化时须要重新计算总体高度
    if (changedMap.has('data') || changedMap.has('defaultHeight') || changedMap.has('version')) {
      this.calculateTotalHeightDebounce();
    }
  }

  private handleScroll(e: Event) {
    this._scrollTo((e.target as HTMLElement).scrollTop);
  }

  private _scrollTo(scrollTop: number) {
    this.scrollTopNum = scrollTop;
    const page = Math.floor(this.scrollTopNum / this.defaultHeight) + 1;
    this.dispatchEvent(new CustomEvent('current-change', { detail: page }));
    // 重新计算可视范围
    this.calculateVisibleRangeDebounce();
  }

  private renderVisibleItems(start: number, end: number) {
    // console.log('renderVisibleItems', start, end);
    // 清空对现有渲染内容的大小监控
    this.itemObserver.disconnect();
    let top = 0;
    for (let i = 0; i < start; i++) {
      top += this.cachedHeights[i] || this.defaultHeight;
    }
    return repeat(this.data.slice(start, end + 1), this.keyFunc, (itm, rIdx) => {
      const divRef: Ref<HTMLDivElement> = createRef();
      const t = top;
      const idx = rIdx + start;
      top += this.cachedHeights[idx] || this.defaultHeight;
      requestAnimationFrame(() => {
        if (divRef.value) {
          this.itemObserver.observe(divRef.value);
        }
      });
      return html`<div ${ref(divRef)} data-idx="${idx}" class="item-container" style="top: ${t}px">${this.renderItem(itm, idx)}</div>`;
    });
  }

  private _reRender() {
    this.version += 1;
  }

  private _calculateVisibleRange() {
    if (!this.data || this.data.length === 0) {
      this.visibleRange = [-1, -1];
      return;
    }
    const start = Math.max(0, Math.floor(this.scrollTopNum / this.defaultHeight) - this.buffer);
    const end = Math.min(this.data.length, Math.ceil((this.scrollTopNum + this.viewportHeight) / this.defaultHeight) + this.buffer);
    this.visibleRange = [start, end];
  }
  private _calculateTotalHeight() {
    let totalHeight = 0;
    if (this.data?.length) {
      for (let i = 0; i < this.data.length; i++) {
        totalHeight += this.cachedHeights[i] || this.defaultHeight;
      }
    }
    if (this.scrollContainerRef.value) {
      this.scrollContainerRef.value.style.height = `${totalHeight}px`;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.viewportObserver.observe(this);
  }

  disconnectedCallback() {
    this.viewportObserver.disconnect();
    this.itemObserver.disconnect();
    super.disconnectedCallback();
  }

  render() {
    return html`<div ${ref(this.viewportRef)} part="viewport" class="viewport" @scroll="${this.handleScroll}">
      <div part="scroll" ${ref(this.scrollContainerRef)} class="scroll-container">${this.renderVisibleItems(...this.visibleRange)}</div>
    </div>`;
  }
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .viewport {
      width: -webkit-fill-available;
      height: 100%;
      overflow: scroll;
      position: relative;
      display: flex;
      justify-content: center;
      /* scrollbar-width: none;
      -ms-overflow-style: none; */
    }
    /* .viewport::-webkit-scrollbar {
      width: 0;
      background: transparent;
    } */
    .scroll-container {
      position: relative;
    }
    .scroll-container .item-container {
      position: absolute;
      left: 0;
    }
  `;
}

customElements.define('pdf-view-virtualizer', Virtualizer);

export { Virtualizer };
