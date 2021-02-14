import { ProcessServerConfigFunction } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useRef } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { getImageDimensionFromPreviewElement } from '../utils/filePond'

// Register FilePond  plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export interface ProcessFileData {
  file: File
  dimensions: ReturnType<typeof getImageDimensionFromPreviewElement>
  errorHandler: (errorText: string) => void
}

interface FileUploaderProps {
  /**
   * Should return file id as a string for filepond
   */
  onProcessFile?: (fileData: ProcessFileData) => string | Promise<string>
  onRemoveFile?: () => void
}

export default function FileUploader(props: FileUploaderProps) {
  const { onRemoveFile, onProcessFile } = props
  const fileContainerRef = useRef<HTMLDivElement>(null)

  const processImage: ProcessServerConfigFunction | undefined = !onProcessFile
    ? undefined
    : async (fieldName, file, metadata, load, error) => {
        try {
          const fileId = await onProcessFile({
            file,
            dimensions: getImageDimensionFromPreviewElement(
              fileContainerRef.current as HTMLDivElement
            ),
            errorHandler: error,
          })

          // Tell filePond, the processing is done
          load(fileId)
        } catch (err) {
          // Tell filePond there is an error
          error(err.message)
        }
      }

  return (
    <div id="fileUploadWrapper" className="relative" ref={fileContainerRef}>
      <FilePond
        // @ts-ignore
        imagePreviewHeight={300}
        onremovefile={onRemoveFile}
        server={onProcessFile ? { process: processImage } : undefined}
      />
    </div>
  )
}
