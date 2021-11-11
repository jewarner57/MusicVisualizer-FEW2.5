function render(frequencyArray, ctx, centerX, centerY, rotationFactor, radius, sunGaps) {

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

  const compressionFactor = 4
  const freqArr = averageArrayValues(Array.from(frequencyArray), compressionFactor)
  const step = ctx.canvas.width / freqArr.length
  const height = centerY * 2 - 5
  const peakHeight = height / 2

  const pointList = freqArr.map((f, i) => {
    const mappedWaveHeight = ((f * 1.3) - 0) / (255 - 0) * (centerY - centerY * 2) + centerY * 2

    return { x: step * i, y: mappedWaveHeight - 5 }
  })

  const waveGrad = ctx.createLinearGradient(0, centerY, ctx.canvas.width, centerY * 2);
  waveGrad.addColorStop(0, '#404aff');
  waveGrad.addColorStop(1, '#66ddff');

  ctx.fillStyle = waveGrad

  ctx.beginPath()
  drawCurveThrough(ctx, pointList, height)
}

function drawCurveThrough(ctx, points, height) {
  ctx.moveTo(0, height);

  for (const point of points) {
    const xMid = (point.x + point.x) / 2;
    const yMid = (point.y + point.y) / 2;
    const cpX1 = (xMid + point.x) / 2;
    const cpX2 = (xMid + point.x) / 2;

    ctx.quadraticCurveTo(cpX1, point.y, xMid, yMid);
    ctx.quadraticCurveTo(cpX2, point.y, point.x, point.y);

  }
  ctx.fill();
}

function averageArrayValues(arr, fctr) {
  const compressedArr = []

  for (let i = 0; i < arr.length - fctr; i += fctr) {
    let averagedVals = 0
    for (let j = 0; j < fctr; j++) {
      averagedVals += arr[i + j]
    }
    averagedVals /= fctr
    compressedArr.push(averagedVals)
  }

  return compressedArr
}

export default render