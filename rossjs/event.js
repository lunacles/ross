export const Interaction = {
  x: 0,
  y: 0,
  left: false,
  right: false,
  held: false,
  doubleClick: false,
  scroll: 0,
  targetScroll: 0,
}

canvas.addEventListener('click', e => {
  switch (e.button) {
    case 0:
      Interaction.left = true
      break
    case 2:
      Interaction.right = true
      break
  }
})
canvas.addEventListener('mousedown', e => {
  Interaction.held = true
})
canvas.addEventListener('mouseup', e => {
  Interaction.held = false
})
canvas.addEventListener('contextmenu', e => {
  e.preventDefault()
  Interaction.right = true
})

canvas.addEventListener('dblclick', () => {
  Interaction.doubleClick = true
})

canvas.addEventListener('mousemove', e => {
  Interaction.x = e.clientX
  Interaction4.y = e.clientY
})
canvas.addEventListener('wheel', e => {
  e.preventDefault()
  Interaction4.targetScroll -= Math.sign(e.deltaY) * 15
})
