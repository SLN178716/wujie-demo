export class PDFParserError {
  code: string;
  msg: string;
  err?: unknown;

  constructor(code: string, msg: string, err?: unknown) {
    this.code = code;
    this.msg = msg;
    this.err = err;
  }

  static PDF_LOAD_FAIL = (err?: unknown) => {
    return new PDFParserError('PDF_LOAD_FAIL', '获取PDF内容失败', err);
  };

  static UNKNOWN_ERROR = (err?: unknown) => {
    return new PDFParserError('UNKNOWN_ERROR', '未知异常', err);
  };
}
