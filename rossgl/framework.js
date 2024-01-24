import Document from './document.js'

const Fragments = {
  fill: await Document.webgl.loadFragment('./rossgl/shaders/fragment/fill.glsl'),
}
const Vertexes = {
  position: await Document.webgl.loadVertex('./rossgl/shaders/vertex/position.glsl'),
}

import {
  Element,
  Rect,
} from './elements.js'
export {
  Document,
  Fragments,
  Vertexes,
  Element,
  Rect,
}