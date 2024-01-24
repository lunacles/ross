attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_center;

void main() {
  vec2 scaledPosition = (a_position + u_center) / u_resolution;
  vec2 clipSpace = (scaledPosition * 2.0) - 1.0;
  gl_Position = vec4(clipSpace, 0, 1);
}
