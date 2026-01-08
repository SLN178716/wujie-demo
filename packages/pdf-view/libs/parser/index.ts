import { getDocument, GlobalWorkerOptions, type PDFDocumentLoadingTask, type PDFDocumentProxy } from 'pdfjs-dist';

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

export class PdfParser {
  private task: PDFDocumentLoadingTask;
  private doc?: PDFDocumentProxy;
  constructor(task: PDFDocumentLoadingTask) {
    this.task = task;
    this.task.promise.then((res) => {
      this.doc = res;
    });
  }
  getTask() {
    return this.task;
  }
  async getDoc() {
    if (!this.doc) {
      await this.task.promise;
    }
    return this.doc;
  }
}

const createPdfParser = async (opt: PdfInitOption): Promise<PdfParser> => {
  const param = await getPdfInitParameters(opt);
  return new PdfParser(getDocument(param));
};

export { createPdfParser, GlobalWorkerOptions };
