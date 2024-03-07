export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export const averageArray = array => array.length ? array.reduce((a, b) => a + b) / array.length : 0

export const sumArray = array => array.reduce((a, b) => a + b, 0)

export const fitTextToArea = ({ text = '', width = 0, height = 0 }) => {
  let aspectRatio = measureText(text, 200).width / 200
  let maxSizeWidth = width / aspectRatio
  return Math.min(maxSizeWidth, height)
}

let getSuffix = day => {
  let last = day % 10
  let lastTwo = day % 100
  if ([11, 12, 13].includes(lastTwo)) return 'th'
  switch (last) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export const formatDate = string => {
  let date = new Date(string)
  try {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    if (!(date instanceof Date && !isNaN(date))) throw new Error('Invalid date')
    let day = date.getUTCDate()
    let name = months[date.getUTCMonth()]
    return `${name} ${day}${getSuffix(day)}, ${date.getUTCFullYear()}`
  } catch (err) {
    console.error('Failed to retrieve date:', err)
  }
}
