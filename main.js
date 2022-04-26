
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
  let controlBody = document.querySelector('.music-control-body')
  let controlContainer = document.querySelector('.music-control-container')
  let title = document.querySelector('.title-bar > p')

  if(controlsVisible) {
    controlContainer.classList.add('music-control-hidden')
    title.classList.add('hidden')
    controlBody.classList.add('hidden')
    controlsVisible = false

    buttonToggleShow.innerHTML = 
    `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z"/>
      </svg>
    `
  }
  else {
    controlContainer.classList.remove('music-control-hidden')
    title.classList.remove('hidden')
    controlBody.classList.remove('hidden')
    controlsVisible = true

    buttonToggleShow.innerHTML = 
    `
      <svg xmlns="http://www.w3.org/2000/svg" fill="#DBDBDB" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z" />
      </svg>
    `
  }
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

function handleFiles(e) {
  const files = e.target.files
  const sourceFile = URL.createObjectURL(files[0])
  musicPlaylist.push({
    name: files[0].name, 
    source: sourceFile
  })
  updatePlaylist()
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
  musicPlaylist.unshift(currentlyPlaying)
  currentlyPlaying = musicPlaylist.pop()

  loadNewSong()
}

function loadNewSong() {
  updatePlaylist()
  paused = false
  if (audio) {
    audio.pause()
  }
  audio = null
  playSound()
}

function updateAudioProgressBar() {
  const bar = document.querySelector(".audio-progress-bar")
  const progress = (audio.currentTime / audio.duration) * 100
  bar.style.width = `${progress}%`

  if(progress >= 100) {
    nextSong()
  }
}

function updatePlaylist() {
  const currSong = document.querySelector('.now-playing > p')
  currSong.innerHTML = currentlyPlaying.name

  const playlistElem = document.querySelector('.playlist-container')

  // remove all songs
  const songs = document.querySelectorAll('.playlist-song')
  for(let song of songs) {
    song.remove()
  }

  // add back in new order
  for (let song of musicPlaylist) {
    let songElem = document.createElement("div")
    
    songElem.classList.add("playlist-song")
    songElem.innerHTML = song.name

    playlistElem.prepend(songElem)

    // If a song in the playlist is clicked
    songElem.addEventListener('click', (e) => {
      const songName = e.target.innerHTML
      const songIndex = musicPlaylist.findIndex((song) => song.name === songName)
      if(songIndex !== -1) {
        // set it as the current song and play it
        let temp = currentlyPlaying
        currentlyPlaying = musicPlaylist[songIndex]
        musicPlaylist.splice(songIndex, 1)
        musicPlaylist.unshift(temp)

        loadNewSong()
      }
    })
  }
}

// Define variables 
let analyser
let frequencyArray
let audio
let visualizer = 'vapor-1'
let animationRef

let currentlyPlaying = { name: "Nomad City - Phaserland", source: "./music/nomad-city.mp3" }
const musicPlaylist = [
  { name: "Socially Distanced - Highway Superstar", source: "./music/socially-distanced.mp3" },
  { name: "Seven Nation Army - The White Stripes", source: "./music/seven-nation.mp3"},
]

updatePlaylist()

// Starts playing the audio
function startAudio() {
  // make a new Audio Object
  audio = new Audio()
  // Get a context 
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // Define a source sound file 
  audio.src = currentlyPlaying.source

  // Make a new analyser
  analyser = audioContext.createAnalyser()
  // Connect the analyser and the audio
  const source = audioContext.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioContext.destination)

  // Get an array of audio data from the analyser
  frequencyArray = new Uint8Array(analyser.frequencyBinCount)

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
  if (audio) {
    updateAudioProgressBar()
  }
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