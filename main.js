
// Notes 
// https://www.kkhaydarov.com/audio-visualizer/
// https://medium.com/@duraraxbaccano/computer-art-visualize-your-music-in-javascript-with-your-browser-part-2-fa1a3b73fdc6

// Import a renderer 
import circleRenderer from './renderers/radialRayMonoRenderer.js'
import circleGridRenderer from './renderers/renderCircleGrid.js'
import circleCenterRenderer from './renderers/renderCircleCenter.js'
import verticalBarsRenderer from './renderers/verticalBarRenderer.js'
import verticalBarsMonoRenderer from './renderers/verticalBarsMonoRenderer.js'
import radialRayRenderer from './renderers/radialRayRenderer.js'
import circleFieldRenderer from './renderers/circleFieldRenderer.js'
import vaporwaveSunFireworkRenderer from './renderers/vaporwaveSunFireworkRenderer.js'
import vaporwaveSunRenderer2 from './renderers/vaporwaveSunRenderer2.js'


// --------------------------------------------------------
// Canvas

// Get reference to the canvas context for use by the 
// renderers below
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

requestAnimationFrame(render)

// ----------------------------------------------------------
// Buttons 
const playButton = document.getElementById('button-play')
const pauseButton = document.getElementById('button-pause')

playButton.addEventListener('click', (e) => {
  startAudio()
})

pauseButton.addEventListener('click', (e) => {
  audio.pause()
  audio = null
})

// --------------------------------------------------------
// Select Dropdowns
const mediaSelect = document.getElementById('music-dropdown')
const visSelect = document.getElementById('vis-dropdown')

mediaSelect.addEventListener('input', (e) => {
  sourceFile = `./music/${e.target.value}`
  audio.pause()
  audio = null
})

visSelect.addEventListener('input', (e) => {
  visualizer = e.target.value
})

// --------------------------------------------------------
// Volume Slider

const volumeSlider = document.getElementById('volumeSlider')

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value
})

// --------------------------------------------------------
// Audio setup

// Defime some variables 
let analyser
let frequencyArray
let audio
let visualizer = 'vapor-1'
let sourceFile = './music/nomad-city.mp3'
let animationRef

// Starts playing the audio
function startAudio() {
  // make a new Audio Object
  audio = new Audio()
  // Get a context 
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // Define a source sound file 
  audio.src = sourceFile

  // Make a new analyser
  analyser = audioContext.createAnalyser()
  // Connect the analyser and the audio
  const source = audioContext.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioContext.destination)

  // Get an array of audio data from the analyser
  frequencyArray = new Uint8Array(analyser.frequencyBinCount)
  // console.log(frequencyArray.length)

  // Start playing the audio
  audio.volume = 0.4
  audio.play()

  if (!animationRef) {
    animationRef = requestAnimationFrame(render)
  }
}

let SunGap = class {
  constructor(x, y, width, startY, maxY, color) {
    this.height = (this.y - this.maxY) / 20
    this.width = width
    this.color = color
    this.startY = startY
    this.maxY = maxY
    this.x = x
    this.y = y
  }

  move(amnt) {
    if (this.y > this.maxY) {
      this.y -= amnt
      this.height = (this.y - this.maxY) / 12
      return
    }
    this.y = this.startY
  }
  draw() {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
};

let rotationFactor = 0
const sunGaps = []

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2
const radius = 100
const startY = centerY + radius
const maxY = centerY - 20

const grad2 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
grad2.addColorStop(0, 'rgba(48, 2, 30, 1)');
grad2.addColorStop(1, 'rgba(0, 0, 0, 1)');
const backgroundColor = grad2

for (let i = 0; i < 10; i++) {
  const width = radius * 2

  const xPos = centerX - radius
  const yPos = centerY + 100 - (i * 12)

  sunGaps.push(new SunGap(xPos, yPos, width, startY, maxY, 'red'))
}

// This function renders the audio to the canvas using a renderer
function render() {
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  renderSun(sunGaps)

  analyser.getByteFrequencyData(frequencyArray)
  rotationFactor += 0.1 / 60

  switch (visualizer) {
    case 'vapor-1':
      vaporwaveSunFireworkRenderer(frequencyArray, ctx, centerX, centerY, rotationFactor, radius)
      break;
    case 'vapor-2':
      vaporwaveSunRenderer2(frequencyArray, ctx, centerX, centerY, rotationFactor, radius)
      break;
    default:
      vaporwaveSunFireworkRenderer(frequencyArray, ctx, centerX, centerY, rotationFactor, radius)
      break;
  }

  animationRef = requestAnimationFrame(render)
}

function renderSun(sunGaps) {
  // Draw the circle in the center
  ctx.beginPath()
  const grad = ctx.createLinearGradient(centerX, centerY - radius + 20, centerX, centerY + radius);
  grad.addColorStop(0, 'rgba(245, 194, 91, 1)');
  grad.addColorStop(1, 'rgba(236, 43, 117, 1)');
  // grad.addColorStop(0, 'rgba(115, 64, 186, 1)');
  // grad.addColorStop(1, 'rgba(216, 34, 85, 1)');
  ctx.fillStyle = grad;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.fill()

  // Draw the sun gaps
  sunGaps.forEach((gap) => {
    gap.move(15 / 60)
    gap.draw()
  })
}