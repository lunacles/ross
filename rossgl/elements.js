import Document from './document.js'
import {
  Fragments,
  Vertexes,
} from './framework.js'

export const Element = class {
  constructor() {
    this.webgl = Document.webgl
    this.gl = Document.webgl.gl

    this.compile()
    this.color = this.gl.getUniformLocation(this.webgl.program, 'u_color')
    this.opacity = 1

    this.count = 0

    this.cache = { type: null }
  }
  async compile() {
    this.webgl.setFragment(Fragments.fill)
    this.webgl.setVertex(Vertexes.position)
    
    this.webgl.compileProgram()
  }
  finish() {
    let primitiveType = this.gl.TRIANGLES
    let offset = 0
    this.gl.drawArrays(primitiveType, offset, this.count)
  }
  convertColor(hex) {
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
    this.y = Document.height - (y + this.height)

    this.count = 6

    this.draw()
  }
  async draw() {
    let positionAttributeLocation = this.gl.getAttribLocation(this.webgl.program, 'a_position')
    let resolutionUniformLocation = this.gl.getUniformLocation(this.webgl.program, 'u_resolution')
  
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
    this.gl.enableVertexAttribArray(positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
  
    let size = 2
    let type = this.gl.FLOAT
    let normalize = false
    let stride = 0
    let offset = 0
    this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
  
    this.gl.uniform2f(resolutionUniformLocation, Document.webgl.width, Document.webgl.height)  
    return this
  }
}