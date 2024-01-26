import Document from './document.js'
import {
  Fragments,
  Vertexes,
} from './framework.js'

export const Element = class {
  constructor() {
    this.webgl = Document.webgl
    this.gl = Document.webgl.gl

    this.opacity = 1
    this.count = 0

    this.cache = { type: null }
  }
  resetCache() {
    this.cache = { type: null }
  }
  setCache(type, run) {
    this.cache = {
      type, run,
    }
  }
  compile(fragment, vertex) {
    this.webgl.setFragment(fragment)
    this.webgl.setVertex(vertex)
    this.webgl.compileProgram()
  }
  finish() {
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.count)
  }
  convertColor(hex) {
    hex = parseInt(hex.replace('#', ''), 16)
    let [r, g, b] =  [(hex >> 16) & 0xFF, (hex >> 8) & 0xFF, hex & 0xFF]
    return [r / 255, g / 255, b / 255]
  }
  alpha(value) {
    this.opacity = value
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    return this
  }
  fill(fill) {
    if (this.cache.type) {
      this.cache.run({ fill, })
    } else {
      this.gl.uniform4fv(this.color, [...this.convertColor(fill), this.opacity])
    }
    this.finish()
    return this
  }
}

export const Rect = class extends Element {
  static draw({ x = 0, y = 0, width = 0, height = 0 }) {
    return new Rect(x, y, width, height)
  }
  constructor(x, y, width, height) {
    super()

    this.width = width
    this.height = height
    this.x = x
    this.y = Document.height - y - height * 0.5

    this.count = 6

    this.compile(Fragments.rect, Vertexes.rect)
    this.position = this.gl.getAttribLocation(this.webgl.program, 'a_position')
    this.resolution = this.gl.getUniformLocation(this.webgl.program, 'u_resolution')
    this.color = this.gl.getUniformLocation(this.webgl.program, 'u_color')

    this.positions = [
      this.x, this.y,
      this.x, this.y + this.height,
      this.x + this.width, this.y,
      this.x + this.width, this.y,
      this.x + this.width, this.y + this.height,
      this.x, this.y + this.height,
    ]

    this.draw()
  }
  draw() {
    let positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
  
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(this.position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    this.gl.vertexAttribPointer(this.position, 2, this.gl.FLOAT, false, 0, 0)
  
    this.gl.uniform2f(this.resolution, Document.webgl.width, Document.webgl.height)  
    return this
  }
}

export const Circle = class extends Element {
  static draw({ x = 0, y = 0, radius = 0, segments = 360 }) {
    return new Circle(x, y, radius, segments)
  }
  constructor(x, y, radius, segments) {
    super()

    this.radius = radius
    this.x = x + this.radius
    this.y = Document.height - y
    this.segments = segments

    this.compile(Fragments.circle, Vertexes.circle)
    this.position = this.gl.getAttribLocation(this.webgl.program, 'a_position')
    this.resolution = this.gl.getUniformLocation(this.webgl.program, 'u_resolution')
    this.center = this.gl.getUniformLocation(this.webgl.program, 'u_center')
    this.color = this.gl.getUniformLocation(this.webgl.program, 'u_color')

    this.positions = this.calculateCircleVertices()
    this.count = this.positions.length / 2

    this.draw()
  }
  draw() {
    let positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW)

    this.gl.enableVertexAttribArray(this.position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    this.gl.vertexAttribPointer(this.position, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.uniform2f(this.center, this.x, this.y)
    this.gl.uniform2f(this.resolution, Document.webgl.width, Document.webgl.height)  

    return this
  }
  calculateCircleVertices() {
    let positions = []
    for (let i = 0; i < this.segments; i++) {
      let angle = (i / this.segments) * 2 * Math.PI
      positions.push(
        this.radius * Math.cos(angle),
        this.radius * Math.sin(angle)
      )
    }
    return positions
  }
}

export const RoundRect = class extends Element {
  static draw({ x = 0, y = 0, width = 0, height = 0, radii = 0 }) {
    return new RoundRect(x, y, width, height, radii)
  }
  constructor(x, y, width, height, radii) {
    super()

    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.radii = radii

    this.draw()
  }
  draw() {
    this.setCache('roundrect', ({ fill, stroke, lineWidth }) => {
      Rect.draw({
        x: this.x + this.radii, y: this.y,
        width: this.width - this.radii * 2, height: this.height,
      }).fill(fill)
      
      Rect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height - this.radii * 2
      }).fill(fill)

      Circle.draw({
        x: this.x, y: this.y - this.height * 0.5 + this.radii,
        radius: this.radii,
      }).fill(fill)
      Circle.draw({
        x: this.x + this.width - this.radii * 2, y: this.y - this.height * 0.5 + this.radii,
        radius: this.radii
      }).fill(fill)
      Circle.draw({
        x: this.x, y: this.y + this.height * 0.5 - this.radii,
        radius: this.radii,
      }).fill(fill)
      Circle.draw({
        x: this.x + this.width - this.radii * 2, y: this.y + this.height * 0.5 - this.radii,
        radius: this.radii
      }).fill(fill)
    })
    return this
  }
}