import Canvas from './canvas.js'
import { Interaction } from './event.js'

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
  canvas: (() => {
    const canvas = document.getElementById('canvas') ?? document.createElement('canvas')
    canvas.setAttribute('id', 'canvas')
    canvas.style.position = 'absolute'
    canvas.style.background = '#000000'
    canvas.style.cursor = 'default'
    return new Canvas(canvas)
  })(),
  refreshCanvas(timeDelta) {
    Document.canvas.setSize({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio })
    Document.canvas.setViewport({ x: 0, y: 0, width: Document.canvas.width, height: Document.canvas.height })

    let smoothFix = Interaction.held ? 1 : 0.075 * (timeDelta / 16.67)
    Interaction.scroll += (Interaction.targetScroll - Interaction.scroll) * smoothFix
    Interaction.targetScroll -= Interaction.targetScroll * smoothFix

    Interaction.left = false
    Interaction.right = false
    Interaction.doubleClick = false
  },
}

export default Document
