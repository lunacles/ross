const WebGL = class {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl')
    if (!this.gl) throw new Error('This browser does not support WebGL.')

    this.vertex = null
    this.fragment = null
    this.vertexShader = null
    this.fragmentShader = null
    this.program = null

    this.width = 1920
    this.height = 1080
    this.scale = 1
  }
  // Clears the canvas to the provided color
  clear({ r = 0.0, g = 0.0, b = 0.0, a = 1.0 }) {
    this.gl.clearColor(r, g, b, a)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }
  async loadVertex(directory) {
    return await fetch(directory).then(response => response.text()).then(text => text.trim())
  }
  async setVertex(vertex) {
    try {
      this.vertex = vertex
      this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
      this.gl.shaderSource(this.vertexShader, this.vertex)
      this.gl.compileShader(this.vertexShader)
      if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) throw new Error(this.gl.getShaderInfoLog(this.vertexShader))
    } catch (err) {
      console.error(err)
      return err
    }
  }
  async loadFragment(directory) {
    return await fetch(directory).then(response => response.text()).then(text => text.trim())
  }
  async setFragment(fragment) {
    try {
      this.fragment = fragment
      this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
      this.gl.shaderSource(this.fragmentShader, this.fragment)
      this.gl.compileShader(this.fragmentShader)
      if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) throw new Error(this.gl.getShaderInfoLog(this.fragmentShader))
    } catch (err) {
      console.error(err)
      return err
    }
  }
  compileProgram() {
    try {
      this.program = this.gl.createProgram()
      this.gl.attachShader(this.program, this.vertexShader)
      this.gl.attachShader(this.program, this.fragmentShader)
      this.gl.linkProgram(this.program)
      this.gl.useProgram(this.program)
    } catch (err) {
      console.error(err)
    }
  }
  setSize({ width = 0, height = 0, scale = 1 }) {
    if (this.width !== width || this.height !== height || this.scale !== scale) {
      this.width = width
      this.height = height
      this.scale = scale

      let cWidth = Math.ceil(width * scale)
      let cHeight = Math.ceil(height * scale)
      this.canvas.width = cWidth
      this.canvas.height = cHeight
      this.canvas.style.width = `${cWidth / scale}px`
      this.canvas.style.height = `${cHeight / scale}px`
    }
    return width / height
  }
  setViewport({ x = 0, y = 0, width = 0, height = 0 }) {
    this.gl.viewport(x, y, width, height)
  }
}

export default WebGL