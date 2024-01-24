import Canvas from './canvas.js'

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

    // TODO: rewrite this in a better way. I felt lazy and cut corners
    if (mouse.held && !mouse.moving) {
      Document.holdTime++
      if (Document.holdTime > 30) {
        mouse.scroll = 0
        mouse.targetScroll = 0
      }
    } else {
      Document.holdTime = 0
    }

    if (Document.holdTime <= 30) {
      let smoothFix = mouse.held ? 1 : 0.075 * (timeDelta / 16.67)
      mouse.scroll += (mouse.targetScroll - mouse.scroll) * smoothFix
      mouse.targetScroll -= mouse.targetScroll * smoothFix
    }

    mouse.left = false
    mouse.right = false
    mouse.doubleClick = false
    mouse.moving = false
    keyboard.e = null
  },
}

export default Document
