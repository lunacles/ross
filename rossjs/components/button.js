import {
  Element,
} from '../elements.js'

import ClickRegion from './clickregion.js'

import { Interaction } from '../event.js'

const Button = class extends Element {
  static create() {
    return new Button()
  }
  constructor() {
    super()

    this.state = false

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.clickRegion = ClickRegion.create()
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.clickRegion.update({
      x: this.x - this.width * 0.5, y: this.y - this.height * 0.5,
      width: this.width * 2, height: this.height * 2,
    })

    if (this.clickRegion.check() && Interaction.left) {
      this.state = !this.state
    }
  }
}

export default Button
