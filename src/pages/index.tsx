// import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { FilePondErrorDescription, FilePondFile } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
// import styles from '../styles/Index.module.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

export default function Index() {
  const onSetImages = async (
    error: FilePondErrorDescription | null,
    filePondFile: FilePondFile
  ) => {
    const fileReader = new FileReader()
    // @ts-ignore
    const nvision = (await import('@nipacloud/nvision/dist/browser/nvision'))
      .default
    const objectDetectionService = nvision.objectDetection({
      apiKey: '',
    })
    fileReader.onload = async () => {
      console.log(`> fileReader.result: `, fileReader.result)
      const base64 = (fileReader.result as string | undefined)?.replace(
        /^data:image\/(\w+);base64,/,
        ''
      )
      const response = await objectDetectionService.predict({
        rawData: base64,
      })
      console.log(`> response: `, response)
    }
    fileReader.readAsDataURL(filePondFile.file)
  }

  // @ts-ignore
  return (
    <div className="max-w-screen-sm mx-auto my-10">
      <h1 className="text-3xl text-center mb-6 font-bold">
        Nipa Nvision - Object Detection
      </h1>
      <div className="m-4">
        <div className="rounded-2xl py-6 px-8 bg-white shadow-md">
          <div className="relative">
            <FilePond
              onaddfile={onSetImages}
              // @ts-ignore
              imagePreviewHeight={300}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto hidden"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
