import { LitElement, html, css, PropertyDeclarations, PropertyValues } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';
import './search-btn';
import './arrow-down-btn';
import './arrow-up-btn';
import './close-btn';

class SearchTool extends LitElement {
  static properties: PropertyDeclarations = {
    metchs: {
      type: Array,
    },
    current: { attribute: false, type: Number },
    visible: { attribute: false, type: Boolean },
    hasStr: { attribute: false, type: Boolean },
  };

  private visible: boolean = false;
  private metchs: unknown[] = [];
  private current: number = 0;
  private hasStr: boolean = false;

  private total: number = 0;
  private inputRef: Ref<HTMLInputElement> = createRef();

  protected willUpdate(cp: PropertyValues) {
    if (cp.has('metchs')) {
      this.total = (this.metchs || []).length;
      this.current = 1;
    }
  }

  private exchangeVisible(e: Event, visible: boolean) {
    e.stopPropagation();
    this.visible = visible;
    if (visible) {
      requestAnimationFrame(() => {
        this.inputRef.value?.focus();
      });
    }
  }

  private changeCurrent(e: CustomEvent, v: number) {
    e.stopPropagation();
    if (v <= 0) {
      this.current = this.total;
    } else if (v > this.total) {
      this.current = 1;
    } else {
      this.current = v;
    }
    this.dispatchEvent(new CustomEvent('search-switch', { detail: this.current, bubbles: true, composed: true }));
  }

  private valueChange(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.hasStr = Boolean(v);
    this.dispatchEvent(new CustomEvent('search-find', { detail: v, bubbles: true, composed: true }));
  }

  render() {
    return html`<div class="search-tool">
      <pdf-view-search-btn @search="${(e: Event) => this.exchangeVisible(e, true)}"></pdf-view-search-btn>
      <div class="search-bar ${this.visible ? '' : 'hidden'}">
        <input ${ref(this.inputRef)} class="input" @input="${this.valueChange}" />
        <span class="count ${this.hasStr ? '' : 'hidden'}">${this.total ? this.current : 0}/${this.total}</span>
        <div class="tools">
          <pdf-view-arrow-up-btn @arrow-up="${(e: CustomEvent) => this.changeCurrent(e, this.current - 1)}"></pdf-view-arrow-up-btn>
          <pdf-view-arrow-down-btn @arrow-down="${(e: CustomEvent) => this.changeCurrent(e, this.current + 1)}"></pdf-view-arrow-down-btn>
          <pdf-view-close-btn @close="${(e: Event) => this.exchangeVisible(e, false)}"></pdf-view-close-btn>
          <pdf-view-drag-btn></pdf-view-drag-btn>
        </div>
      </div>
    </div>`;
  }

  static styles = css`
    .search-tool {
      position: relative;
      --tools-btn-size: 25px;
    }
    .search-bar {
      position: fixed;
      display: flex;
      align-items: center;
      background-color: #333333;
      border: 1px solid #b6b6b6;
      z-index: 9999;
      border-radius: 10px;
      right: 10px;
      padding: 5px;
    }
    .search-bar.hidden {
      display: none;
    }
    .search-bar > .input {
      border: none;
      outline: none;
      background: transparent;
      width: 150px;
      line-height: 1.5;
    }
    .search-bar > .count {
      margin-right: 5px;
      font-size: smaller;
    }
    .search-bar > .count.hidden {
      opacity: 0;
    }
    .search-bar > .tools {
      display: flex;
      align-items: center;
      border-left: 2px solid #b6b6b6;
    }
  `;
}

customElements.define('pdf-view-search-tool', SearchTool);

export { SearchTool };
