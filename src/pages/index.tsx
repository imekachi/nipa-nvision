import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
// import styles from '../styles/Index.module.css'
import { ObjectDetectionResult } from '@nipacloud/nvision/dist/models/NvisionRequest'
import { useRef, useState } from 'react'
import { convertFileToBase64 } from '../utils/files'
import { getObjectDetectionService } from '../operations/nvision'
import { getImageDimensionFromPreviewElement } from '../utils/filePond'
import { ProcessServerConfigFunction } from 'filepond'

// Register FilePond  plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

interface MainState {
  isLoading: boolean
  previewDimension?: { width: number; height: number }
  imageDimension?: { width: number; height: number }
  previewScalingFactor?: number
  detectedObjects?: ObjectDetectionResult[]
}
const defaultState = {
  isLoading: false,
}

export default function Index() {
  const [state, setState] = useState<MainState>(defaultState)
  const fileContainerRef = useRef<HTMLDivElement>(null)

  const processImage: ProcessServerConfigFunction = async (
    fieldName,
    file,
    metadata,
    load,
    error
  ) => {
    // Get base64 from file
    const base64 = await convertFileToBase64(file, {
      withoutHeader: true,
    })
    const objectDetectionService = await getObjectDetectionService()
    try {
      setState({ isLoading: true })
      const response = await objectDetectionService.predict({
        rawData: base64,
      })
      console.log(`> response: `, response)
      const dimensions = getImageDimensionFromPreviewElement(
        fileContainerRef.current as HTMLDivElement
      )
      // Tell filePond, the processing is done
      load(response.service_id as string)

      setState({
        isLoading: false,
        // @ts-ignore, it actually "detected_objects" not "detected_object" as declared in the package
        detectedObjects: response.detected_objects,
        previewDimension: dimensions.previewDimension,
        imageDimension: dimensions.imageDimension,
        previewScalingFactor: dimensions.previewScalingFactor,
      })
    } catch (err) {
      // Tell filePond there is an error
      error(err)
    }
  }

  console.log(`> state: `, state)

  return (
    <div className="max-w-screen-sm mx-auto my-10">
      <h1 className="text-3xl text-center mb-6 font-bold">
        Nipa Nvision - Object Detection
      </h1>
      <div className="m-4">
        <div className="rounded-2xl py-6 px-8 bg-white shadow-md">
          <div
            id="fileUploadWrapper"
            className="relative"
            ref={fileContainerRef}
          >
            <FilePond
              // @ts-ignore
              imagePreviewHeight={300}
              server={{ process: processImage }}
            />
            {!state.isLoading && !!state.detectedObjects && (
              <div
                className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                style={state.previewDimension}
              >
                <div className="absolute" />
                {/*{state.detectedObjects.map((detectedObject, objectIndex) => {*/}
                {/*  return (*/}
                {/*    <div key={objectIndex} className="absolute" />*/}
                {/*  )*/}
                {/*})}*/}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
