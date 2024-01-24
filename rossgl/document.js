import WebGL from './webgl.js'

const Document = {
  get width() {
    return window.innerWidth
  },
  get height() {
    return window.innerHeight
  },
  get centerX() {
    return Document.width * 0.5
  },
  get centerY() {
    return Document.height * 0.5
  },
  get ratio() {
    return window.devicePixelRatio
  },
  webgl: (() => {
    const canvas = document.getElementById('canvas')// ?? document.createElement('canvas')
    if (!canvas) throw new Error('Canvas not found.')
    /*
    canvas.setAttribute('id', 'canvas')
    canvas.style.position = 'absolute'
    canvas.style.background = '#000000'
    canvas.style.cursor = 'default'
    */
    return new WebGL(canvas)
  })(),
  holdTime: 0,
  refreshCanvas(timeDelta) {
    Document.webgl.setSize({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio })
    webglUtils.resizeCanvasToDisplaySize(Document.webgl.gl.canvas)
    Document.webgl.setViewport({ x: 0, y: 0, width: Document.webgl.width, height: Document.webgl.height })
  },
}

export default Document