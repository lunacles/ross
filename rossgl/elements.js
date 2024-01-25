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
  compile(fragment, vertex) {
    this.webgl.setFragment(fragment)
    this.webgl.setVertex(vertex)
    this.webgl.compileProgram()
  }
  finish() {
    let offset = 0
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, offset, this.count)
  }
  convertColor(hex) {
    hex = parseInt(hex.replace('#', ''), 16)
    let [r, g, b] =  [(hex >> 16) & 0xFF, (hex >> 8) & 0xFF, hex & 0xFF]
    return [r / 255, g / 255, b / 255]
  }
  alpha(value) {
    this.opacity = value
    return this
  }
  fill(color) {
    this.gl.uniform4fv(this.color, [...this.convertColor(color), this.opacity])
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
    this.y = Document.height - y

    this.count = 6

    this.compile(Fragments.rect, Vertexes.rect)
    this.position = this.gl.getAttribLocation(this.webgl.program, 'a_position')
    this.resolution = this.gl.getUniformLocation(this.webgl.program, 'u_resolution')
    this.color = this.gl.getUniformLocation(this.webgl.program, 'u_color')

    this.draw()
  }
  draw() {
    let positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
  
    let positions = [
      this.x, this.y,
      this.x, this.y + this.height,
      this.x + this.width, this.y,
      this.x + this.width, this.y,
      this.x + this.width, this.y + this.height,
      this.x, this.y + this.height,
    ]
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(this.position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
  
    let size = 2
    let type = this.gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0
    this.gl.vertexAttribPointer(this.position, size, type, normalize, stride, offset)
  
    this.gl.uniform2f(this.resolution, Document.webgl.width, Document.webgl.height)  
    return this
  }
}

export const Circle = class extends Element {
  static draw({ x = 0, y = 0, radius = 0 }) {
    return new Circle(x, y, radius)
  }
  constructor(x, y, radius) {
    super()

    this.radius = radius
    this.x = x
    this.y = Document.height - y + this.radius

    this.compile(Fragments.circle, Vertexes.circle)
    this.position = this.gl.getAttribLocation(this.webgl.program, 'a_position')
    this.resolution = this.gl.getUniformLocation(this.webgl.program, 'u_resolution')
    this.center = this.gl.getUniformLocation(this.webgl.program, 'u_center')
    this.color = this.gl.getUniformLocation(this.webgl.program, 'u_color')

    this.draw()
  }
  draw() {
    let positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    let positions = this.calculateCircleVertices()
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)

    this.gl.enableVertexAttribArray(this.position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

    let size = 2
    let type = this.gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0
    this.gl.vertexAttribPointer(this.position, size, type, normalize, stride, offset)


    this.gl.uniform2f(this.center, this.x, this.y)
    this.gl.uniform2f(this.resolution, Document.webgl.width, Document.webgl.height)  

    this.count = positions.length / 2
    return this
  }

  calculateCircleVertices() {
    let positions = []
    let segments = 360
    for (let i = 0; i < segments; i++) {
      let angle = (i / segments) * 2 * Math.PI
      positions.push(
        this.radius * Math.cos(angle),
        this.radius * Math.sin(angle)
      )
    }
    return positions
  }
}

