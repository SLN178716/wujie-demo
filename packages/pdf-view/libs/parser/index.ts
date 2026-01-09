import { getDocument, GlobalWorkerOptions, type PDFDocumentLoadingTask, type PDFDocumentProxy } from 'pdfjs-dist';

import { InterceptorManager } from './interceptor';
import type { PdfInitOption, DocumentInitParameters } from '../../types';

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
  private errCB: PdfParserOption['errorCallback'];
  readonly interceptor: {
    afterTaskInit: InterceptorManager<PDFDocumentLoadingTask>;
    afterDocInit: InterceptorManager<PDFDocumentProxy>;
  };

  constructor(opt: PdfParserOption) {
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
    console.log('reset');
    this.doc?.destroy();
    this.task?.destroy();
    this.task = null;
    this.doc = null;
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
        console.log('task.promise');
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

  static create = (opt: PdfParserOption): PdfParser => {
    return new PdfParser(opt);
  };
}

export { GlobalWorkerOptions };
