export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function removeBase64ImageHeader(base64: string) {
  return base64.replace(/^data:image\/(\w+);base64,/, '')
}
