function render(frequencyArray, ctx, centerX, centerY, rotationFactor, radius) {
  const compressionFactor = 2
  let freqArr = averageArrayValues(Array.from(frequencyArray), compressionFactor)
  freqArr = freqArr.slice(10, freqArr.length / 2)
  const step = (ctx.canvas.width / freqArr.length) / 2
  const height = centerY * 2 - 5
  const peakHeight = height / 2

  let pointList = freqArr.map((f, i) => {
    const mappedWaveHeight = ((f * 1) - 0) / (255 - 0) * (centerY - centerY * 2) + centerY * 2

    return { x: step * i, y: mappedWaveHeight - 5 }
  })

  // mirror pointlist for symmetrical frequency graph
  pointList = [...pointList.slice().reverse(), ...pointList]

  const waveGrad = ctx.createLinearGradient(0, centerY, ctx.canvas.width, centerY * 2);
  waveGrad.addColorStop(0, '#404aff');
  waveGrad.addColorStop(1, '#66ddff');

  ctx.fillStyle = waveGrad

  ctx.beginPath()
  drawCurveThrough(ctx, pointList, height, step)
}

function drawCurveThrough(ctx, points, height, step) {
  ctx.moveTo(0, height);

  let count = 0
  for (const point of points) {
    const xMid = (count + count) / 2;
    const yMid = (point.y + point.y) / 2;
    const cpX1 = (xMid + count) / 2;
    const cpX2 = (xMid + count) / 2;

    ctx.quadraticCurveTo(cpX1, point.y, xMid, yMid);
    ctx.quadraticCurveTo(cpX2, point.y, count, point.y);
    count += step
  }

  ctx.lineTo(ctx.canvas.width, height);

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
