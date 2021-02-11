import { Sdk } from '@nipacloud/nvision/dist/Sdk'
import getNextConfig from 'next/config'

export type ObjectDetectionService = ReturnType<typeof Sdk.objectDetection>
let objectDetectionService: ObjectDetectionService

const { publicRuntimeConfig } = getNextConfig()

export async function getObjectDetectionService(): Promise<ObjectDetectionService> {
  if (!objectDetectionService) {
    // @ts-ignore
    const nvision = (await import('@nipacloud/nvision/dist/browser/nvision'))
      .default as typeof Sdk
    objectDetectionService = nvision.objectDetection({
      apiKey: publicRuntimeConfig.API_KEY,
    })
  }

  return objectDetectionService
}

export function getBoundingBoxStyle(
  boundingBox: {
    top: number
    bottom: number
    left: number
    right: number
  },
  scalingFactor = 1
): {
  top: number
  left: number
  width: number
  height: number
} {
  const width = boundingBox.right - boundingBox.left
  const height = boundingBox.bottom - boundingBox.top
  return {
    top: boundingBox.top * scalingFactor,
    left: boundingBox.left * scalingFactor,
    width: width * scalingFactor,
    height: height * scalingFactor,
  }
}
