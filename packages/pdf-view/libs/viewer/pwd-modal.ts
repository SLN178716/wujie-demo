import { LitElement, type PropertyDeclarations, html, css } from 'lit';
import { ref, createRef, type Ref } from 'lit/directives/ref.js';

export interface ModalInitOptions {
  title?: string;
  content?: string;
  confirm?: (pwd: string) => unknown;
  cancel?: () => unknown;
}

export type ShowModalOptions = {
  rootEle: HTMLElement;
} & Required<Pick<ModalInitOptions, 'confirm' | 'cancel'>> &
  Exclude<ModalInitOptions, 'confirm' | 'cancel'>;

export class PwdModal extends LitElement {
  static properties: PropertyDeclarations = {
    _title: { type: String },
    _content: { type: String },
    value: { type: Boolean },
  };

  protected _title: string;
  protected _content: string;
  protected value: boolean;

  private inputRef: Ref<HTMLInputElement> = createRef();
  private confirmCallback: ((pwd: string) => unknown) | undefined;
  private cancelCallback: (() => unknown) | undefined;

  constructor(opt: ModalInitOptions) {
    super();
    this.value = false;
    this._title = opt.title || '';
    this._content = opt.content || '';
    this.confirmCallback = opt.confirm;
    this.cancelCallback = opt.cancel;
  }

  show() {
    this.changeValue(true);
  }

  hide() {
    this.changeValue(false);
  }

  confirm() {
    const v = this.inputRef.value?.value || '';
    this.confirmCallback?.(v);
    this.dispatchEvent(new CustomEvent('confirm', { detail: v }));
    this.hide();
  }

  cancel() {
    this.cancelCallback?.();
    this.dispatchEvent(new CustomEvent('cancel'));
    this.hide();
  }

  private changeValue(v: boolean) {
    this.value = v;
    this.dispatchEvent(new CustomEvent('change', { detail: v }));
  }

  destory() {
    this.parentNode?.removeChild(this);
  }

  static show(opt: ShowModalOptions): PwdModal {
    const option = Object.assign(
      {
        title: '请输入密码',
        content: '此文件受密码保护。请输入密码以打开文件。',
      },
      opt
    );
    const pwd_modal = new PwdModal(option);
    option.rootEle.appendChild(pwd_modal);
    pwd_modal.show();
    return pwd_modal;
  }

  render() {
    return html`<div class="pwd-modal-mask ${this.value ? 'show' : 'hide'}">
      <div class="pwd-modal-container">
        <div class="title">${this._title}</div>
        <div class="content">${this._content}</div>
        <input class="pwd-input" ${ref(this.inputRef)} type="password" placeholder="请输入密码" />
        <div class="btns">
          <button class="btn-confirm" @click="${this.confirm.bind(this)}">打开文件</button>
          <button class="btn-cancel" @click="${this.cancel.bind(this)}">取消</button>
        </div>
      </div>
    </div>`;
  }

  static styles = css`
    .pwd-modal-mask {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #6a6a6af1;
    }
    .pwd-modal-mask.hide {
      display: none;
    }
    .pwd-modal-container {
      width: 200px;
      border-radius: 5px;
      background-color: #333333;
      padding: 15px;
      line-height: 1;
      color: #fff;
    }
    .pwd-modal-container > .title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .pwd-modal-container > .content {
      font-size: small;
      margin-bottom: 10px;
    }
    .pwd-modal-container > .pwd-input {
      padding: 0 5px;
      width: calc(100% - 10px);
      line-height: 2;
      margin-bottom: 10px;
      border: none;
      background-color: #555555;
    }
    .pwd-modal-container > .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
    }
    .pwd-modal-container > .btns > button {
      width: 45%;
      text-align: center;
      border: none;
      line-height: 2;
    }
    .pwd-modal-container > .btns > .btn-confirm {
      background-color: #006cbe;
    }
    .pwd-modal-container > .btns > .btn-cancel {
      background-color: #4d4d4d;
    }
  `;
}
