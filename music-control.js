// ----------------------------------------------------------
// Buttons 
const playButton = document.getElementById('button-play')
const pauseButton = document.getElementById('button-pause')
const buttonToggleShow = document.getElementById('button-toggle-show')
let controlsVisible = true

playButton.addEventListener('click', (e) => {
  playSound()
})

pauseButton.addEventListener('click', (e) => {
  stopSound()
})

buttonToggleShow.addEventListener('click', (e) => {
  playClick()
  const controls = document.getElementById('hideable-control-wrapper')

  if (controlsVisible) {
    controls.style.display = 'none'
    controlsVisible = false
    return
  }
  controls.style.display = 'flex'
  controlsVisible = true
})

// --------------------------------------------------------
// Select Dropdowns
const mediaSelect = document.getElementById('music-dropdown')
const visSelect = document.getElementById('vis-dropdown')

mediaSelect.addEventListener('input', (e) => {
  sourceFile = `./music/${e.target.value}`
  upload.setAttribute('data-before', 'Upload Custom Song');
  stopSound()
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
// Song Upload
const upload = document.getElementById("upload")
upload.addEventListener("change", handleFiles, false);
upload.setAttribute('data-before', 'Upload Custom Song');

function handleFiles(e) {
  const files = e.target.files
  sourceFile = URL.createObjectURL(files[0])
  e.target.setAttribute('data-before', files[0].name);
  mediaSelect.value = "Custom"

  stopSound()
}

// --------------------------------------------------------
// Audio setup

function stopSound() {
  audio.pause()
  audio = null

  playButton.style.backgroundColor = "rgb(0, 155, 155)"
  pauseButton.style.backgroundColor = 'rgb(160, 34, 97)'

  playClick()
}

function playSound() {
  playClick()

  if (!audio) {
    startAudio()
  }

  pauseButton.style.backgroundColor = "rgb(0, 155, 155)"
  playButton.style.backgroundColor = 'rgb(160, 34, 97)'
}

function playClick() {
  var audio = new Audio("./music/click.wav");
  audio.play();
}

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