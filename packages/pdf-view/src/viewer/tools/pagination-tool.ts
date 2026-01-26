import { LitElement, type PropertyDeclarations, html, css, type PropertyValues } from 'lit';
import './page-prev-btn';
import './page-next-btn';
import { debounce } from '../../utils';

class PaginationTool extends LitElement {
  static properties: PropertyDeclarations = {
    total: { type: Number },
    current: {
      type: Number,
      attribute: false,
    },
  };

  protected total: number = 0;
  protected current: number = 0;

  private pageTo: (n: number | string) => void;

  constructor() {
    super();
    this.pageTo = debounce(this._pageTo, 1000);
  }

  protected willUpdate(changedMap: PropertyValues) {
    if (changedMap.has('total')) {
      this.current = this.total >= 1 ? 1 : 0;
    }
  }

  public setPage(n: number) {
    this._pageTo(n);
  }

  public setCurrent(n: number | string) {
    let v = parseInt(`${n}`);
    if (v > this.total) {
      v = this.total;
    } else if (this.total === 0) {
      v = 0;
    } else if (v < 1) {
      v = 1;
    }
    this.current = v;
  }

  public getPage() {
    return this.current;
  }

  private _changeCurrent(e: Event, n?: number) {
    e.stopPropagation();
    if (n !== null && n !== void 0) {
      this._pageTo(n);
    } else {
      this.pageTo((e.target as HTMLInputElement).value);
    }
  }

  private _pageTo(n: number | string) {
    this.setCurrent(n);
    this.dispatchEvent(new CustomEvent('page-change', { detail: this.current, bubbles: true, composed: true }));
  }

  render() {
    return html`<div class="pagination-tool">
      <pdf-view-page-prev-btn @page-prev="${(e: Event) => this._changeCurrent(e, --this.current)}"></pdf-view-page-prev-btn>
      <div class="page">
        <input class="input" .value=${`${this.current}`} type="number" min="${this.total === 0 ? 0 : 1}" max="${this.total}" step="1" @input="${this._changeCurrent}" />
        <span class="split">/</span>
        <span>${this.total}</span>
      </div>
      <pdf-view-page-next-btn @page-next="${(e: Event) => this._changeCurrent(e, ++this.current)}"></pdf-view-page-next-btn>
    </div>`;
  }

  static styles = css`
    :host {
      height: var(--tools-btn-size);
      display: block;
    }
    .pagination-tool {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pagination-tool .page {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pagination-tool .page .input {
      width: 3em;
      border: none;
      background-color: #444444;
      text-align: center;
      line-height: 1.5;
    }
    .pagination-tool .page .split {
      margin: 0 5px;
    }
  `;
}

customElements.define('pdf-view-pagination-tool', PaginationTool);

export { PaginationTool };
