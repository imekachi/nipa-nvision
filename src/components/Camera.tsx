import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'

export interface SnapPhotoData {
  base64: string
  dimensions: {
    imageDimension: { width: number; height: number }
    previewDimension: { width: number; height: number }
  }
}

export interface CameraProps {
  imageWidth?: number
  imageHeight?: number
  onSnap?: (snapData: SnapPhotoData) => any
  onReset?: () => void
}

type CameraErrorCode = 'NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'NOT_FOUND'

const errorMessagesByCode: Record<CameraErrorCode, string> = {
  NOT_SUPPORTED:
    'This browser is not supported, please try again in Google Chrome',
  PERMISSION_DENIED: 'Please allow access to a camera',
  NOT_FOUND: 'Cannot detect a camera',
}

// TODO: add flash effect when taking a photo
export default function Camera(props: CameraProps) {
  const { onSnap, onReset, imageWidth = 400, imageHeight = 300 } = props

  const [previewPhotoMode, setPreviewPhotoMode] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [
    cameraErrorCode,
    setCameraErrorCode,
  ] = useState<CameraErrorCode | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleSnap = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        const [streamTrack] = streamRef.current?.getTracks() ?? []
        const streamInfo = streamTrack?.getSettings() ?? {}

        const imageDimension = {
          width: streamInfo.width ?? imageWidth,
          height: streamInfo.height ?? imageHeight,
        }
        // We're using video as preview dimension because in this state
        // The canvas doesn't get rendered and updated yet.
        const previewDimension = {
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        }

        // Make the canvas have exact same size as the video preview
        canvasRef.current.width = previewDimension.width
        canvasRef.current.height = previewDimension.height

        context.drawImage(
          videoRef.current,
          0,
          0,
          imageDimension.width, // render using real image dimension
          imageDimension.height
        )

        setPreviewPhotoMode(true)
        const snapData = {
          base64: canvasRef.current.toDataURL(),
          dimensions: { imageDimension, previewDimension },
        }
        try {
          setIsProcessing(true)
          await onSnap?.(snapData)
        } catch (err) {
          console.error(`> Error! onSnap(): `, { err, snapData })
        } finally {
          setIsProcessing(false)
        }
      }
    }
  }

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setPreviewPhotoMode(false)
    onReset?.()
  }

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const getMediaStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              aspectRatio: imageWidth / imageHeight,
              width: { exact: imageWidth },
              height: { exact: imageHeight },
              // facingMode: { exact: 'environment' },
            },
          })
          if (videoRef.current) {
            // pass stream to video to live preview
            videoRef.current.srcObject = stream
            videoRef.current.play()
            // save stream for cleaning
            streamRef.current = stream
            setCameraErrorCode(null)
          }
        } catch (err) {
          console.error(`> Error when requesting camera access `, err)
          setCameraErrorCode(
            err.message === 'Permission denied'
              ? 'PERMISSION_DENIED'
              : 'NOT_FOUND'
          )
        }
      }
      getMediaStream()
    } else if (!cameraErrorCode || cameraErrorCode !== 'NOT_SUPPORTED') {
      setCameraErrorCode('NOT_SUPPORTED')
    }

    // Cleaning function
    return () => {
      // Stop using camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [cameraErrorCode, imageHeight, imageWidth])

  return (
    <div>
      <div
        className="relative text-center bg-black rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ minHeight: 300 }}
      >
        {!!cameraErrorCode && (
          <div className="p-4 m-4 text-white rounded-lg bg-red-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {errorMessagesByCode[cameraErrorCode]}
          </div>
        )}
        <video
          ref={videoRef}
          className={`w-auto h-auto max-w-full max-h-full ${
            previewPhotoMode || cameraErrorCode ? 'hidden' : ''
          }`}
          style={{ transform: 'rotateY(180deg)' }}
          width={imageWidth}
          height={imageHeight}
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className={`max-w-full ${
            !previewPhotoMode || cameraErrorCode ? 'hidden' : ''
          }`}
        />
        {previewPhotoMode && (
          <div className="absolute top-0 right-0">
            {isProcessing ? (
              <div className="p-4 text-pink-500">
                <FontAwesomeIcon icon={faCircleNotch} spin />
              </div>
            ) : (
              <button
                title="Reset"
                className="text-white transition-color duration-300 hover:text-pink-500 p-4 focus:outline-none cursor-pointer"
                onClick={handleReset}
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
            )}
          </div>
        )}
      </div>
      {/* Total height of the component should equal to the preview image height */}
      {/* Otherwise, the preview overlay will not be in the correct position */}
      {!previewPhotoMode && (
        <div className="text-center mt-4">
          <button
            title="Take a photo"
            className="w-14 h-14 text-white rounded-full focus:outline-none bg-pink-500"
            onClick={handleSnap}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
        </div>
      )}
    </div>
  )
}
