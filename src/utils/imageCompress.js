/**
 * Compress image (data URL) to JPEG base64 for storing in Firestore.
 * Firestore doc limit is 1MB; we target ~250KB per image so 3 photos + form data fit.
 */
const MAX_SIZE_KB = 220
const MAX_DIMENSION = 800
const INITIAL_QUALITY = 0.7

export function compressImageDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(null)
      return
    }
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = (height / width) * MAX_DIMENSION
          width = MAX_DIMENSION
        } else {
          width = (width / height) * MAX_DIMENSION
          height = MAX_DIMENSION
        }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      let quality = INITIAL_QUALITY
      let jpeg = canvas.toDataURL('image/jpeg', quality)
      let sizeKb = (jpeg.length * 3) / 4 / 1024
      while (sizeKb > MAX_SIZE_KB && quality > 0.2) {
        quality -= 0.1
        jpeg = canvas.toDataURL('image/jpeg', quality)
        sizeKb = (jpeg.length * 3) / 4 / 1024
      }
      resolve(jpeg)
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = dataUrl
  })
}
