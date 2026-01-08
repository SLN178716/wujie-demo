import { getDocument } from 'pdfjs-dist';

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export type DocumentInitParameters = Exclude<Required<Parameters<typeof getDocument>>[0], string | URL | TypedArray | ArrayBuffer>;

interface RemotePdfInitOption {
  type: 'remote';
  data: string;
  options?: DocumentInitParameters;
}

interface LocalPdfInitOption {
  type: 'local';
  data: string;
  options?: DocumentInitParameters;
}

interface Base64PdfInitOption {
  type: 'base64';
  data: string;
  options?: DocumentInitParameters;
}

interface BlobPdfInitOption {
  type: 'blob';
  data: Blob;
  options?: DocumentInitParameters;
}

interface CustomPdfInitOption {
  type?: 'custom';
  options?: DocumentInitParameters;
}

export type PdfInitOption = RemotePdfInitOption | LocalPdfInitOption | Base64PdfInitOption | BlobPdfInitOption | CustomPdfInitOption;

const errorEnums = {
  PDF_LOAD_FAIL: '获取PDF内容失败',
  UNKNOWN_ERROR: '未知异常',
};

export interface ErrorType {
  code: keyof typeof errorEnums;
  msg: string;
}

type ErrorEnumsType = {
  [key in ErrorType['code']]: ErrorType;
};

export const ErrorEnums = new Proxy(errorEnums, {
  get(target, p: ErrorType['code']): ErrorType {
    return {
      code: p,
      msg: target[p],
    };
  },
  set: () => false,
}) as unknown as ErrorEnumsType;
