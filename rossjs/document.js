import Canvas from './canvas.js'
import Interaction from './interaction.js'

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
  holdTime: 0,
  refreshCanvas(timeDelta) {
    Document.canvas.setSize({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio })
    Document.canvas.setViewport({ x: 0, y: 0, width: Document.canvas.width, height: Document.canvas.height })

    if (Interaction.mouse.leftHeld && !Interaction.mouse.moving) {
      Document.holdTime++
      if (Document.holdTime > 30) {
        Interaction.mouse.scroll = 0
        Interaction.mouse.targetScroll = 0
      }
    } else {
      Document.holdTime = 0
    }

    if (Document.holdTime <= 30) {
      let smoothFix = Interaction.mouse.leftHeld ? 1 : 0.075 * (timeDelta / 16.67)
      Interaction.mouse.scroll += (Interaction.mouse.targetScroll - Interaction.mouse.scroll) * smoothFix
      Interaction.mouse.targetScroll -= Interaction.mouse.targetScroll * smoothFix
    }

    Interaction.reset()
  },
}

export default Document
