import sharp from 'sharp'
import { Stream, } from 'stream'

export const validateUsername = (text: string) => !/[^A-Za-z0-9_]/g.test(text)
export const validatePhonenumber = (text: string) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(text)

export const isJpg = (buffer: Buffer): boolean => {
	if (!buffer || buffer.length < 3) return false
	return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
}

export const convertToJpg = async (image: Buffer): Promise<Buffer> => {
  if (isJpg(image)) return image
  return await sharp(image).jpeg().toBuffer()
}

export const streamToBuffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
      const _buf = Array <any> ()
      stream.on('data', chunk => _buf.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(_buf)))
      stream.on('error', error => reject(`${error}`))
  })
}

const hashChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateHash = () => {
  let hash = ''
  for (let i = 0; i < 16; i++) hash += hashChars.charAt(Math.floor(Math.random() * hashChars.length))
  return hash
}

export const getS3Key = (path: string | null) => {
  if (!path) return null
  return path.split('/')[path.split('/').length - 1]
}

export const getAge = (inputDate: Date | string) => {
  const dob = new Date(inputDate)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const birthYear = dob.getFullYear()
  const birthMonth = dob.getMonth()
  const birthDay = dob.getDate()
  let age = currentYear - birthYear
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) age--
  return age
}
