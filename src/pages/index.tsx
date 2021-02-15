import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectDetectionResult } from '@nipacloud/nvision/dist/models/NvisionRequest'
import Head from 'next/head'
import NextImg from 'next/image'
import { useState } from 'react'
import BoundingBox from '../components/BoundingBox'
import Camera, { SnapPhotoData } from '../components/Camera'
import DetectionResult from '../components/DetectionResult'
import FileUploader, { ProcessFileData } from '../components/FileUploader'
import { ObjectCategoryName } from '../config/nvision'
import { detectObjectFromImage } from '../operations/nvision'
import { convertFileToBase64 } from '../utils/files'
import { getScalingFactor } from '../utils/sizing'

interface ObjectDetectionState {
  isLoading: boolean
  previewDimension?: { width: number; height: number }
  imageDimension?: { width: number; height: number }
  previewScalingFactor?: number
  detectedObjects?: ObjectDetectionResult[]
}
interface FilterState {
  activeObjectIndex: number | null
  activeCategory: ObjectCategoryName | null
}

const defaultObjectDetectionState: ObjectDetectionState = {
  isLoading: false,
}
const defaultFilterState: FilterState = {
  activeObjectIndex: null,
  activeCategory: null,
}

type ImageInputMode = 'file' | 'camera'

export default function Index() {
  const [inputMode, setInputMode] = useState<ImageInputMode>('file')
  const [
    objectDetectionState,
    setObjectDetectionState,
  ] = useState<ObjectDetectionState>(defaultObjectDetectionState)
  const [filterState, setFilterState] = useState<FilterState>(
    defaultFilterState
  )

  const resetAllState = () => {
    setObjectDetectionState(defaultObjectDetectionState)
    setFilterState(defaultFilterState)
  }

  const switchInputMode = (inputMode: ImageInputMode) => {
    setInputMode(inputMode)
    resetAllState()
  }

  const processImageDetection = async ({
    base64,
    dimensions,
  }: SnapPhotoData) => {
    setObjectDetectionState({ isLoading: true })
    const result = await detectObjectFromImage(base64)

    setObjectDetectionState({
      isLoading: false,
      // @ts-ignore, it actually "detected_objects" not "detected_object" as declared in the package
      detectedObjects: result.detected_objects,
      previewDimension: dimensions.previewDimension,
      imageDimension: dimensions.imageDimension,
      previewScalingFactor: getScalingFactor(
        dimensions.previewDimension.width,
        dimensions.imageDimension.width
      ),
    })

    return result.service_id
  }

  const processFile = async ({ file, dimensions }: ProcessFileData) => {
    setObjectDetectionState({ isLoading: true })
    const base64 = await convertFileToBase64(file)
    const imageId = await processImageDetection({ base64, dimensions })
    return imageId as string
  }

  return (
    <div className="max-w-screen-sm mx-auto pt-10 pb-20">
      <Head>
        <title>Nvision Object Detection - Nipa Cloud</title>
      </Head>
      <h1 className="text-3xl text-center mb-6 font-bold">
        <span className="inline-block w-6">
          <NextImg
            src="https://nvision.nipa.cloud/img/Home.e24230e1.png"
            width={1144}
            height={1067}
          />
        </span>{' '}
        Nvision Object Detection
      </h1>
      <div className="p-4">
        <div className="rounded-2xl p-6 bg-white shadow-md">
          <ul className="grid grid-cols-2 gap-4 text-center mb-8">
            <li
              className={`${
                inputMode === 'file'
                  ? 'text-pink-500 border-pink-500'
                  : 'text-gray-700 border-transparent hover:text-pink-500'
              } p-2 border-b-2 transition duration-300 cursor-pointer`}
              onClick={() => switchInputMode('file')}
            >
              <FontAwesomeIcon
                icon={faImage}
                title="Upload an image"
                className="sm:mr-2"
              />
              <span className="hidden sm:inline">Upload an image</span>
            </li>
            <li
              className={`${
                inputMode === 'camera'
                  ? 'text-pink-500 border-pink-500'
                  : 'text-gray-700 border-transparent hover:text-pink-500'
              } p-2 border-b-2 transition duration-300 cursor-pointer`}
              onClick={() => switchInputMode('camera')}
            >
              <FontAwesomeIcon
                icon={faCamera}
                title="Take a photo"
                className="sm:mr-2"
              />
              <span className="hidden sm:inline">Take a photo</span>
            </li>
          </ul>
          <div className="relative">
            {inputMode === 'file' && (
              <FileUploader
                onProcessFile={processFile}
                onRemoveFile={resetAllState}
              />
            )}
            {inputMode === 'camera' && (
              <Camera onSnap={processImageDetection} onReset={resetAllState} />
            )}
            {!objectDetectionState.isLoading &&
              !!objectDetectionState.detectedObjects && (
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 m-auto pointer-events-none"
                  style={objectDetectionState.previewDimension}
                >
                  {objectDetectionState.detectedObjects.map(
                    (detectedObject, objectIndex) => {
                      if (
                        (Number.isFinite(filterState.activeObjectIndex) &&
                          filterState.activeObjectIndex !== objectIndex) ||
                        (filterState.activeCategory &&
                          filterState.activeCategory !== detectedObject.parent)
                      ) {
                        return null
                      }
                      return (
                        <BoundingBox
                          key={objectIndex}
                          detectedObject={detectedObject}
                          scalingFactor={
                            objectDetectionState.previewScalingFactor
                          }
                        />
                      )
                    }
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="mt-8">
          {!objectDetectionState.isLoading &&
          objectDetectionState.imageDimension &&
          !objectDetectionState.detectedObjects ? (
            <div className="text-center text-gray-500">
              We cannot detect anything,
              <br />
              you can try another image :)
            </div>
          ) : (
            <DetectionResult
              detectedObjects={objectDetectionState.detectedObjects}
              filterState={filterState}
              setFilterState={setFilterState}
            />
          )}
        </div>
      </div>
    </div>
  )
}
