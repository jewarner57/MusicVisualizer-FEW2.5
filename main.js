
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
const playButton = document.getElementById('play-button')
const buttonToggleShow = document.querySelector('.button-toggle-hide-controls')
const buttonNextSong = document.querySelector('.skip-forward-button')
const buttonPrevSong = document.querySelector('.skip-backward-button')
let controlsVisible = true
let paused = true

playButton.addEventListener('click', () => {
  if(paused) {
    playSound()
    paused = false
    return
  }
  pauseSound()
  paused = true
})

buttonToggleShow.addEventListener('click', (e) => {
  
})

buttonNextSong.addEventListener('click', () => {
  nextSong()
})

buttonPrevSong.addEventListener('click', () => {
  previousSong()
})

// --------------------------------------------------------
// Select Visualizer
const firework = document.querySelector('.firework-vis-button')
const freqVis = document.querySelector('.freq-vis-button')

firework.addEventListener('click', () => {
  firework.classList.add('vis-selected')
  freqVis.classList.remove('vis-selected')
  visualizer = 'vapor-1'
})

freqVis.addEventListener('click', () => {
  firework.classList.remove('vis-selected')
  freqVis.classList.add('vis-selected')
  visualizer = 'vapor-2'
})

// --------------------------------------------------------
// Volume Slider

const volumeSlider = document.getElementById('volumeSlider')

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value
})

// --------------------------------------------------------
// Song Upload
const upload = document.getElementById("upload")
upload.addEventListener("change", handleFiles, false);
upload.setAttribute('data-before', 'Upload Custom Song');

function handleFiles(e) {
  const files = e.target.files
  sourceFile = URL.createObjectURL(files[0])
  e.target.setAttribute('data-before', files[0].name);
  mediaSelect.value = "Custom"
}

// --------------------------------------------------------
// Audio setup

function pauseSound() {
  if(audio) {
    audio.pause()
  }
  
  playButton.innerHTML = `
  <svg width='29' height='32' viewBox='0 0 29 32' fill='white' xmlns='http://www.w3.org/2000/svg'>
    <path d='M0 31.6667V0L28.5 15.8333L0 31.6667Z' />
  </svg>`
}

function playSound() {
  if (!audio) {
    startAudio()
  }
  else {
    audio.play()
  }

  playButton.innerHTML = `
  <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6 32H0V0H11.6V32ZM29 0H17.4V32H29V0Z" fill="white"/>
  </svg>`
}

function nextSong() {
  musicPlaylist.push(currentlyPlaying)
  currentlyPlaying = musicPlaylist.shift()
  
  loadNewSong()
}

function previousSong() {
  const temp = currentlyPlaying
  currentlyPlaying = musicPlaylist.pop()
  musicPlaylist.unshift(temp)

  loadNewSong()
}

function loadNewSong() {
  paused = false
  if (audio) {
    audio.pause()
  }
  audio = null
  playSound()
}

// Define variables 
let analyser
let frequencyArray
let audio
let visualizer = 'vapor-1'
let sourceFile = './music/nomad-city.mp3'
let animationRef

let currentlyPlaying = { name: "Nomad City - Phaserland", source: "./music/nomad-city.mp3" }
const musicPlaylist = [
  { name: "Socially Distanced - Highway Superstar", source: "./music/socially-distanced.mp3" },
  { name: "Seven Nation Army - The White Stripes", source: "./music/seven-nation.mp3"},
]

// Starts playing the audio
function startAudio() {
  // make a new Audio Object
  audio = new Audio()
  // Get a context 
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // Define a source sound file 
  audio.src = currentlyPlaying.source 
  console.log(currentlyPlaying)
  
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