import { getDocument, GlobalWorkerOptions, type PDFPageProxy, type PDFDocumentLoadingTask, type PDFDocumentProxy } from 'pdfjs-dist';

import { InterceptorManager } from './interceptor';
import type { PdfInitOption, DocumentInitParameters } from '../types';

const getPdfInitParameters = async (opt: PdfInitOption): Promise<DocumentInitParameters> => {
  const def: DocumentInitParameters = Object.assign({}, opt.options || {});
  switch (opt.type) {
    case 'remote':
    case 'local':
      def.url = opt.data;
      break;
    case 'base64':
      if (opt.data.startsWith('data:application/pdf;base64,')) {
        def.data = atob(opt.data.substring(28));
      } else {
        def.data = atob(opt.data);
      }
      break;
    case 'blob':
      def.data = await opt.data.arrayBuffer();
      break;
  }
  return def;
};

interface PdfParserOption {
  errorCallback?: (err: unknown) => unknown;
}
export class PdfParser {
  private task?: PDFDocumentLoadingTask | null;
  private doc?: PDFDocumentProxy | null;
  private pages: PDFPageProxy[];
  private errCB: PdfParserOption['errorCallback'];
  readonly interceptor: {
    afterTaskInit: InterceptorManager<PDFDocumentLoadingTask>;
    afterDocInit: InterceptorManager<PDFDocumentProxy>;
  };

  constructor(opt: PdfParserOption) {
    this.pages = [];
    this.errCB = opt.errorCallback || Promise.reject;
    const afterTaskInit = new InterceptorManager<PDFDocumentLoadingTask>();
    const afterDocInit = new InterceptorManager<PDFDocumentProxy>();
    afterTaskInit.use((task) => {
      return (this.task = task);
    });
    afterDocInit.use((doc) => {
      return (this.doc = doc);
    });
    this.interceptor = {
      afterTaskInit,
      afterDocInit,
    };
  }

  reset() {
    this.doc?.destroy();
    this.task?.destroy();
    this.task = null;
    this.doc = null;
    this.pages = [];
  }

  parse(opt: PdfInitOption) {
    this.reset();
    const cb = this.errCB || Promise.reject;
    let taskPromise = getPdfInitParameters(opt).then(getDocument, (err) => cb(err)) as Promise<PDFDocumentLoadingTask>;
    for (const interceptor of this.interceptor.afterTaskInit) {
      const fulfilled = interceptor.fulfilled;
      const rejected = interceptor.rejected || cb;
      taskPromise = taskPromise.then(fulfilled, (err) => rejected(err)) as Promise<PDFDocumentLoadingTask>;
    }
    let docPromise: Promise<PDFDocumentProxy> = taskPromise.then(
      (task) => {
        return task.promise;
      },
      (err) => cb(err)
    ) as Promise<PDFDocumentProxy>;
    for (const interceptor of this.interceptor.afterDocInit) {
      const fulfilled = interceptor.fulfilled;
      const rejected = interceptor.rejected || cb;
      docPromise = docPromise.then(fulfilled, (err) => rejected(err)) as Promise<PDFDocumentProxy>;
    }
  }

  getTask() {
    return this.task;
  }
  getDoc() {
    return this.doc;
  }
  getNumPages(): number {
    if (!this.doc) throw new Error('PDF文档未载入');
    return this.doc.numPages;
  }
  async getPage(page: number): Promise<PDFPageProxy> {
    const numPages = this.getNumPages();
    if (page > numPages) throw new Error(`第${page}页超出PDF总页数${numPages}`);
    return this.pages[page] || (await this.doc!.getPage(page));
  }

  static create = (opt: PdfParserOption = {}): PdfParser => {
    return new PdfParser(opt);
  };
}

export { GlobalWorkerOptions };
