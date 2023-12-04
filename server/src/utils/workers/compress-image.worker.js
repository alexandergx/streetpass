const { parentPort } = require('worker_threads')
const sharp = require('sharp')

let size, quality, compressedImageBuffer

parentPort.on('message', async (message) => {
  switch (message.type) {
    case 'processImage':
      size = message.size
      quality = message.quality
      const inputBuffer = Buffer.from(message.imageBuffer)
      try {
        compressedImageBuffer = await sharp(inputBuffer)
          .rotate()
          .resize(size, null, { withoutEnlargement: true, })
          .jpeg({ quality })
          .toBuffer()
        parentPort.postMessage({ type: 'compressedImage', data: Uint8Array.from(compressedImageBuffer), })
      } catch (err) {
        parentPort.postMessage({ 
          type: 'error', 
          error: { message: err.message, }, 
        })
      }
      break
    case 'createThumbnail':
      const thumbnailSize = message.size
      const thumbnailQuality = message.quality
      try {
        const thumbnailBuffer = await sharp(compressedImageBuffer)
          .resize(thumbnailSize, null, { withoutEnlargement: true, })
          .jpeg({ quality: thumbnailQuality, })
          .toBuffer()
        parentPort.postMessage({ type: 'thumbnailImage', data: Uint8Array.from(thumbnailBuffer), })
      } catch (err) {
        parentPort.postMessage({ 
          type: 'error', 
          error: { message: err.message, }, 
        })
      }
      break
    case 'createCompact':
      const compactSize = message.size
      const compactQuality = message.quality
      try {
        const compactBuffer = await sharp(compressedImageBuffer)
          .resize(compactSize, null, { withoutEnlargement: true, })
          .jpeg({ quality: compactQuality, })
          .toBuffer()
        parentPort.postMessage({ type: 'compactImage', data: Uint8Array.from(compactBuffer), })
      } catch (err) {
        parentPort.postMessage({ 
          type: 'error', 
          error: { message: err.message, }, 
        })
      }
      break
  }
})
