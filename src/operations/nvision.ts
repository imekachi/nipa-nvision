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
