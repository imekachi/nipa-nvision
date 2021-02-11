export function getImageDimensionFromPreviewElement(
  containerEl: HTMLElement
): {
  imageDimension: { width: number; height: number }
  previewDimension: { width: number; height: number }
  previewScalingFactor: number
} {
  const previewEl = containerEl.querySelector(
    '.filepond--image-clip'
  ) as HTMLDivElement

  const imageCanvas = previewEl.querySelector(
    '.filepond--image-canvas-wrapper'
  ) as HTMLDivElement

  const previewDimension = {
    width: previewEl.clientWidth,
    height: previewEl.clientHeight,
  }
  const imageDimension = {
    width: imageCanvas.clientWidth,
    height: imageCanvas.clientHeight,
  }

  return {
    previewDimension,
    imageDimension,
    previewScalingFactor: previewDimension.width / imageDimension.width,
  }
}
