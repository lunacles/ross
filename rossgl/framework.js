import Document from './document.js'

const Fragments = {
  rect: await Document.webgl.loadFragment('./rossgl/shaders/fragment/rect.glsl'),
  circle: await Document.webgl.loadVertex('./rossgl/shaders/fragment/circle.glsl'),
}
const Vertexes = {
  rect: await Document.webgl.loadVertex('./rossgl/shaders/vertex/rect.glsl'),
  circle: await Document.webgl.loadVertex('./rossgl/shaders/vertex/circle.glsl'),
}

import {
  Element,
  Rect,
  Circle,
} from './elements.js'
export {
  Document,
  Fragments,
  Vertexes,
  Element,
  Rect,
  Circle,
}