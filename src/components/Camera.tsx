import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch'
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

// TODO: handle unsupported browser
// TODO: add flash effect
export default function Camera(props: CameraProps) {
  const { onSnap, onReset, imageWidth = 400, imageHeight = 300 } = props

  const [previewPhotoMode, setPreviewPhotoMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleSnap = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, imageWidth, imageHeight)
        setPreviewPhotoMode(true)
        const snapData = {
          base64: canvasRef.current.toDataURL(),
          dimensions: {
            imageDimension: { width: imageWidth, height: imageHeight },
            previewDimension: {
              width: videoRef.current.clientWidth,
              height: videoRef.current.clientHeight,
            },
          },
        }
        try {
          setIsLoading(true)
          await onSnap?.(snapData)
        } catch (err) {
          console.error(`> Error! onSnap(): `, { err, snapData })
        } finally {
          setIsLoading(false)
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
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          //video.src = window.URL.createObjectURL(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
          }
        })
    }
  }, [])

  return (
    <div>
      <div className="relative text-center bg-black rounded-2xl overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className={`max-w-full ${previewPhotoMode ? 'hidden' : ''}`}
          style={{ transform: 'rotateY(180deg)' }}
          width={imageWidth}
          height={imageHeight}
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className={`max-w-full ${!previewPhotoMode ? 'hidden' : ''}`}
          width={imageWidth}
          height={imageHeight}
        />
        {previewPhotoMode && (
          <div className="absolute top-0 right-0">
            {isLoading ? (
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
        <div className="text-center">
          <button
            title="Take a photo"
            className="w-14 h-14 text-white rounded-full mt-4 focus:outline-none bg-pink-500"
            onClick={handleSnap}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
        </div>
      )}
    </div>
  )
}
