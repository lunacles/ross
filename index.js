import {
  Fragments,
  Vertexes,
  Document,
  Rect,
  Circle,
} from './rossgl/framework.js'

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  Rect.draw({
    x: Document.centerX, y: Document.centerY,
    width: 100, height: 100,
  }).fill('#ffffff')

  Circle.draw({
    x: Document.centerX - 200, y: Document.centerY,
    radius: 50,
  }).fill('#ffffff')

  Document.refreshCanvas(timeElapsed)
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
