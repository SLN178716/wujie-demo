class HtmlCanvas {
  private canvas: HTMLCanvasElement
  private ctx2D: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement | null) {
    if (canvas) {
      this.canvas = canvas
    } else {
      this.canvas = document.createElement('canvas')
    }
    this.ctx2D = this.canvas.getContext('2d')!
  }

  get value() {
    return this.canvas
  }
  
  set value(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx2D = this.canvas.getContext('2d')!
  }
}

type HtmlCanvasType = typeof HtmlCanvas
export type {
  HtmlCanvasType
}

export default HtmlCanvas