function render(frequencyArray, ctx, centerX, centerY, rotationFactor) {
  const radius = 100
  // Clear the canvas

  // Draw the circle in the center
  ctx.beginPath()

  const grad = ctx.createLinearGradient(centerX, centerY - radius, centerX, centerY + radius);
  grad.addColorStop(0, 'rgba(245, 194, 91, 1)');
  grad.addColorStop(1, 'rgba(236, 43, 117, 1)');

  ctx.fillStyle = grad;

  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.fill()

  // Divide the circle into steps equal to the number frequencies
  const bars = frequencyArray.length
  const step = Math.PI * 2 / bars

  // Loop over audio data
  frequencyArray.forEach((f, i) => {
    // calculate the length of the line
    const barLength = f / 255 * (radius * 3)
    // calculate the starting x and y 
    const x1 = (Math.cos(step * i + rotationFactor) * radius) + centerX
    const y1 = (Math.sin(step * i + rotationFactor) * radius) + centerY
    // calculate the ending x and y
    const x2 = (Math.cos(step * i + rotationFactor) * (radius + barLength)) + centerX
    const y2 = (Math.sin(step * i + rotationFactor) * (radius + barLength)) + centerY

    ctx.beginPath()
    ctx.strokeStyle = `hsl(202, ${70 / 1024 * i + 30}%, 43%)`
    // ctx.strokeStyle = 'hsl(202, 100%, 63%)'
    // Move to the starting x and y
    ctx.moveTo(x1, y1)
    // draw a line to the end x and y
    ctx.lineTo(x2, y2)
    ctx.stroke()
  })

}

export default render