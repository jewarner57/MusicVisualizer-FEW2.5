
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
})

// --------------------------------------------------------
// Select Dropdowns
const mediaSelect = document.getElementById('music-dropdown')
const visSelect = document.getElementById('vis-dropdown')

mediaSelect.addEventListener('input', (e) => {
  audio.pause()
  audio = null
  sourceFile = `./music/${e.target.value}`
  startAudio()
})

visSelect.addEventListener('input', (e) => {
  visualizer = e.target.value
})

// --------------------------------------------------------
// Audio setup

// Defime some variables 
let analyser
let frequencyArray
let audio
let visualizer = 'vapor-1'
let sourceFile = './music/nomad-city.mp3'

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
  audio.play()

  requestAnimationFrame(render)
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

  analyser.getByteFrequencyData(frequencyArray)
  rotationFactor += 0.1 / 60

  // Use one of the renderers below 
  // radialRayRenderer(frequencyArray, ctx, centerX, centerY, radius)
  // verticalBarsMonoRenderer(frequencyArray, ctx, 12, 300, 300)
  // verticalBarsRenderer(frequencyArray, ctx, 300, 300)
  // circleCenterRenderer(frequencyArray, ctx, centerX, centerY)
  // circleGridRenderer(frequencyArray, ctx, 300, 300)
  // circleRenderer(frequencyArray, ctx, centerX, centerY, radius)
  // circleFieldRenderer(frequencyArray, ctx, centerX, centerY)

  switch (visualizer) {
    case 'vapor-1':
      vaporwaveSunFireworkRenderer(frequencyArray, ctx, centerX, centerY, rotationFactor, radius, sunGaps)
      break;
    case 'vapor-2':
      vaporwaveSunRenderer2(frequencyArray, ctx, centerX, centerY, rotationFactor, radius, sunGaps)
      break;
    default:
      vaporwaveSunFireworkRenderer(frequencyArray, ctx, centerX, centerY, rotationFactor, radius, sunGaps)
      break;
  }




  // ctx.fillStyle = backgroundColor
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Set up the next animation frame
  requestAnimationFrame(render)
}