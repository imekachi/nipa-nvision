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

type ImageInputMode = 'file' | 'camera'

export default function Index() {
  const [state, setState] = useState<MainState>(defaultState)
  // TODO: refactor filter into one state
  const [activeObjectIndex, setActiveObjectIndex] = useState<number | null>(
    null
  )
  const [
    activeCategory,
    setActiveCategory,
  ] = useState<ObjectCategoryName | null>(null)

  const [inputMode, setInputMode] = useState<ImageInputMode>('file')

  const resetAllState = () => {
    setState(defaultState)
    setActiveCategory(null)
    setActiveObjectIndex(null)
  }

  const switchInputMode = (inputMode: ImageInputMode) => {
    setInputMode(inputMode)
    resetAllState()
  }

  const processImageDetection = async ({
    base64,
    dimensions,
  }: SnapPhotoData) => {
    setState({ isLoading: true })
    const result = await detectObjectFromImage(base64)
    console.log(`> result: `, result)

    setState({
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
    setState({ isLoading: true })
    const base64 = await convertFileToBase64(file)
    const imageId = await processImageDetection({ base64, dimensions })
    return imageId as string
  }

  console.log(`> state: `, { activeCategory, activeObjectIndex, state })

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
