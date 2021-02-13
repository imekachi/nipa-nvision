import { ObjectDetectionResult } from '@nipacloud/nvision/dist/models/NvisionRequest'
import { ProcessServerConfigFunction } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useRef, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import BoundingBox from '../components/BoundingBox'
import DetectionResult from '../components/DetectionResult'
import { ObjectCategoryName } from '../config/nvision'
import { detectObjectFromImage } from '../operations/nvision'
import { getImageDimensionFromPreviewElement } from '../utils/filePond'

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
  const [activeObjectIndex, setActiveObjectIndex] = useState<number | null>(
    null
  )
  const [
    activeCategory,
    setActiveCategory,
  ] = useState<ObjectCategoryName | null>(null)
  const fileContainerRef = useRef<HTMLDivElement>(null)

  const resetAllState = () => {
    setState(defaultState)
    setActiveCategory(null)
    setActiveObjectIndex(null)
  }

  const processImage: ProcessServerConfigFunction = async (
    fieldName,
    file,
    metadata,
    load,
    error
  ) => {
    try {
      console.log(`> metadata: `, metadata)
      setState({ isLoading: true })
      const result = await detectObjectFromImage(file)
      console.log(`> result: `, result)
      const dimensions = getImageDimensionFromPreviewElement(
        fileContainerRef.current as HTMLDivElement
      )
      // Tell filePond, the processing is done
      load(result.service_id as string)

      setState({
        isLoading: false,
        // @ts-ignore, it actually "detected_objects" not "detected_object" as declared in the package
        detectedObjects: result.detected_objects,
        previewDimension: dimensions.previewDimension,
        imageDimension: dimensions.imageDimension,
        previewScalingFactor: dimensions.previewScalingFactor,
      })
    } catch (err) {
      // Tell filePond there is an error
      error(err)
    }
  }

  console.log(`> state: `, { activeCategory, activeObjectIndex, state })

  return (
    <div className="max-w-screen-sm mx-auto my-10">
      <h1 className="text-3xl text-center mb-6 font-bold">
        Nipa Nvision - Object Detection
      </h1>
      <div className="m-4">
        <div className="rounded-2xl p-6 bg-white shadow-md">
          <div
            id="fileUploadWrapper"
            className="relative"
            ref={fileContainerRef}
          >
            <FilePond
              // @ts-ignore
              imagePreviewHeight={300}
              onremovefile={resetAllState}
              server={{ process: processImage }}
            />
            {!state.isLoading && !!state.detectedObjects && (
              <div
                className="absolute top-0 left-0 right-0 bottom-0 m-auto pointer-events-none"
                style={state.previewDimension}
              >
                {state.detectedObjects.map((detectedObject, objectIndex) => {
                  if (
                    (Number.isFinite(activeObjectIndex) &&
                      activeObjectIndex !== objectIndex) ||
                    (activeCategory && activeCategory !== detectedObject.parent)
                  ) {
                    return null
                  }
                  return (
                    <BoundingBox
                      key={objectIndex}
                      detectedObject={detectedObject}
                      scalingFactor={state.previewScalingFactor}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          {!state.isLoading &&
          state.imageDimension &&
          !state.detectedObjects ? (
            <div className="text-center text-gray-500">
              We cannot detect anything,
              <br />
              you can try another image :)
            </div>
          ) : (
            <DetectionResult
              detectedObjects={state.detectedObjects}
              activeObjectIndex={activeObjectIndex}
              setActiveObjectIndex={setActiveObjectIndex}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}
        </div>
      </div>
    </div>
  )
}
