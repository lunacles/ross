import {
  Fragments,
  Vertexes,
  Document,
  Rect,
  Circle,
  RoundRect,
} from '../rossgl/framework.js'

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  Rect.draw({
    x: Document.centerX, y: 100,
    width: 100, height: 100,
  }).alpha(0.25).fill('#ff0000')

  Circle.draw({
    x: Document.centerX, y: Document.centerY,
    radius: 50,
  }).fill('#ffffff')

  RoundRect.draw({
    x: 100, y: 100,
    width: 100, height: 100,
    radii: 10,
  }).fill('#ffffff')

  Document.refreshCanvas(timeElapsed)
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
