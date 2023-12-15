const { parentPort } = require('worker_threads')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const { promisify } = require('util')
const tmp = require('tmp-promise')
const pipeline = promisify(require('stream').pipeline)
const { Readable } = require('stream')
const crypto = require('crypto')
const fileType = require('file-type')

function bufferToStream(buffer) {
  const readable = new Readable({ read() {
    this.push(buffer)
    this.push(null)
  } })
  return readable
}

function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err)
        return
      }
      const duration = metadata && metadata.format && metadata.format.duration
      if (!duration) {
        reject(new Error('Unable to fetch video duration'))
        return
      }
      resolve(duration)
    })
  })
}

let videoSize, videoLength, thumbnailSize

parentPort.on('message', async (message) => {
  switch (message.type) {
    case 'processVideo':
      videoSize = message.videoSize
      videoLength = message.videoLength
      if (message.thumbnail) thumbnailSize = message.thumbnailSize
      const videoBuffer = message.videoBuffer
      const videoMute = message.videoMute
      const thumbnail = message.thumbnail
      const videoReadStream = bufferToStream(videoBuffer)
      let inputTmp, outputTmp
      try {
        const detectedType = await fileType.fromBuffer(videoBuffer)
        const ext = detectedType ? detectedType.ext : 'mov'
        inputTmp = await tmp.file({ postfix: `.${ext}`, })
        outputTmp = await tmp.file({ postfix: '.mp4', })
        await pipeline(videoReadStream, fs.createWriteStream(inputTmp.path))
        const duration = await getVideoDuration(inputTmp.path)
        if (duration > videoLength) throw new Error('Video length too long')
        await new Promise(async (resolve, reject) => {
          ffmpeg(inputTmp.path)
            .outputOptions([
              // '-c:v libx264',
              // '-preset fast',
              '-movflags frag_keyframe+faststart',
              `-vf scale=${videoSize}:-2`,
              // ...(videoMute ? ['-an'] : []),
              '-c:v libx264',
              '-preset medium',
              // '-crf 26',
              // '-movflags frag_keyframe+faststart',
              // `-vf scale=${videoSize}:-2`,
              ...(videoMute ? ['-an'] : ['-b:a 96k']),
            ])
            .output(outputTmp.path)
            // .on('stderr', (stderrLine) => { console.log(`FFMPEG STDERR: ${stderrLine}`) })
            .on('error', reject)
            .on('end', async () => {
              const compressedVideoBuffer = await fs.promises.readFile(outputTmp.path)
              if (thumbnail) {
                const thumbnailFilename = `${crypto.randomBytes(16).toString('hex')}.jpg`;
                let thumbnailBuffer
                try {
                  await new Promise((resolveThumbnail, rejectThumbnail) => {
                    ffmpeg(inputTmp.path)
                      .on('error', rejectThumbnail)
                      .output(thumbnailFilename)
                      .outputOptions([
                        '-vf', `scale=${thumbnailSize}:-1`,
                        '-frames:v', '1'
                      ])
                      .on('end', resolveThumbnail)
                      .run()
                  })
                  thumbnailBuffer = await fs.promises.readFile(thumbnailFilename)
                  await fs.promises.unlink(thumbnailFilename)
                } catch (err) {
                  console.log('[THUMBNAIL GENERATION ERROR]', err)
                  parentPort.postMessage({ 
                    type: 'error', 
                    error: { message: err.message, }, 
                  })
                }
                parentPort.postMessage({ type: 'videoAndThumbnail', data: { compressedVideo: compressedVideoBuffer, thumbnail: thumbnailBuffer, }, })
              } else {
                parentPort.postMessage({ type: 'compressedVideo', data: compressedVideoBuffer, })
              }
              await inputTmp.cleanup()
              await outputTmp.cleanup()
              resolve()
            })
            .run()
        })
      } catch (err) {
        console.log('[VIDEO COMPRESSION ERROR]', err)
        if (inputTmp) await inputTmp.cleanup()
        if (outputTmp) await outputTmp.cleanup()
        parentPort.postMessage({ 
          type: 'error', 
          error: { message: err.message, }, 
        })
      }
      break
  }
})
