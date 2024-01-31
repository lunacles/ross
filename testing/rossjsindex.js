import {
  Document,
  Interaction,
  LocalStorage,
  util,

  Element,
  Rect,
  RoundRect,
  Circle,
  Arc,
  Line,
  Bar,
  Text,
  Poly,
  Clip,

  ClickRegion,
  Button,
  Interpolator,
  Toggle,
  CheckBox,
} from '../rossjs/framework.js'

const color = {
  white: '#ffffff',
  black: '#000000',
  burple: '#5f66c4',
  red: '#ff0000',
}

const exampleToggle = Toggle.create({
  defaultState: false,
  onToggle: () => {},
  sliderColor: color.white,
  activeColor: color.burple,
  inactiveColor: color.white,
})

const exampleCheckBox = CheckBox.create({
  defaultState: false,
  onToggle: () => {},
  checkColor: color.white,
  backgroundColor: color.burple,
})

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  let spacing = 5
  let rectSize = 100
  Rect.draw({
    x: spacing, y: spacing,
    width: rectSize, height: rectSize,
  }).alpha(0.25).fill(color.red)

  let circleRadius = 50
  Circle.draw({
    x: spacing * 2 + rectSize, y: spacing,
    radius: circleRadius,
  }).fill(color.white)

  RoundRect.draw({
    x: spacing * 3 + rectSize + circleRadius * 2, y: spacing,
    width: rectSize, height: rectSize,
    radii: 10,
  }).fill(color.black).stroke(color.white, 2.5)

  Bar.draw({
    x: spacing * 4 + rectSize * 2 + circleRadius * 2, y: spacing,
    width: rectSize * 1.5, height: rectSize,
  }).fill(color.white)

  exampleToggle.draw({
    x: spacing, y: spacing * 2 + rectSize,
    width: rectSize * 2, height: rectSize,
    border: 5
  })

  exampleCheckBox.draw({
    x: spacing * 2 + rectSize * 2, y: spacing * 2 + rectSize,
    width: rectSize, height: rectSize
  })

  Document.refreshCanvas(timeElapsed)
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
  