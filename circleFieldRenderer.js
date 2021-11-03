// -------------------------------------------------
// Draw circle field across the canvas

function render(frequencyArray, ctx, centerX, centerY) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.21)'
  ctx.fillRect(0, 0, 300, 300)
  ctx.fill()

  const bars = frequencyArray.length
  const colorStep = 360 / bars
  const pi2 = Math.PI * 2

  // Draw circles centered in canvas
  frequencyArray.forEach((f, i) => {
    ctx.beginPath()
    ctx.fillStyle = `rgb(100, ${f}, 100)`;
    ctx.arc(centerX + i / 2, centerY + i / 2, f * 0.5, 0, pi2)
    ctx.fill()
  })
}

export default render