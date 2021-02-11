export function convertFileToBase64(
  file: File,
  option: { withoutHeader?: boolean } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(
        option.withoutHeader
          ? base64.replace(/^data:image\/(\w+);base64,/, '')
          : base64
      )
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
