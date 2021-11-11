function render(frequencyArray, ctx, centerX, centerY, rotationFactor, radius) {

  // Divide the circle into steps equal to the number frequencies
  const bars = frequencyArray.length
  const step = Math.PI * 2

  // Loop over audio data
  for (let i = 0; i < frequencyArray.length - 1; i += 360 / frequencyArray.length) {
    let f = frequencyArray[Math.round(i)]
    let f1 = frequencyArray[Math.round(i + 1)]

    // calculate the length of the line
    const barLength = f / 255 * (radius * 1) + ((step * i / 360) % 360) * 30
    const barLength1 = f1 / 255 * (radius * 1.5) + ((step * i / 360) % 360) * 30

    // calculate the starting x and y 
    const x1 = (Math.cos(step * i + rotationFactor) * radius) + centerX
    const y1 = (Math.sin(step * i + rotationFactor) * radius) + centerY
    // calculate the ending x and y
    const x2 = (Math.cos(step * i + rotationFactor) * (radius + barLength)) + centerX
    const y2 = (Math.sin(step * i + rotationFactor) * (radius + barLength)) + centerY

    const f1x2 = (Math.cos(step * i + rotationFactor) * (radius + barLength1)) + centerX
    const f1y2 = (Math.sin(step * i + rotationFactor) * (radius + barLength1)) + centerY

    ctx.strokeStyle = `hsla(${150 / 1024 * i + 190}, 50%, 50%, 50%)`
    // ctx.strokeStyle = 'hsl(202, 100%, 63%)'
    ctx.beginPath()
    ctx.lineWidth = f / 15

    // Move to the starting x and y
    ctx.lineTo(x2, y2)
    // draw a line to the end x and y
    ctx.lineTo(f1x2, f1y2)

    ctx.stroke()
  }
}

export default render
