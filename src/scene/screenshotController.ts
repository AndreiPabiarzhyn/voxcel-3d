let canvasEl: HTMLCanvasElement | null = null

export function registerCanvas(canvas: HTMLCanvasElement) {
  canvasEl = canvas
}

export function unregisterCanvas() {
  canvasEl = null
}

/** Downloads whatever the 3D view currently shows as a PNG. */
export function captureScreenshot(fileName: string) {
  if (!canvasEl) return
  canvasEl.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName || 'voxcel-screenshot'}.png`
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
