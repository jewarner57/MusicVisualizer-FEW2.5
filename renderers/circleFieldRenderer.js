// -------------------------------------------------
// Draw circle field across the canvas

function render(frequencyArray, ctx, centerX, centerY) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.21)'
  ctx.fillRect(0, 0, 300, 300)
  ctx.fill()

  const bars = frequencyArray.length
  const pi2 = Math.PI * 2

  // Draw circles from array
  frequencyArray.forEach((f, i) => {

    ctx.beginPath()
    ctx.fillStyle = `hsl(${f}, 100%, 50%)`;
    ctx.arc((i % 300) + 1, Math.round(i / 300) * 50 + 100, f * 0.2 + 1, 0, pi2)
    ctx.fill()
  })
}

export default render