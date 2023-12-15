import * as dotenv from 'dotenv'; dotenv.config()
import { NestFactory, } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
import { Logger } from './utils/services'
import * as fs from 'fs'
import { InputLimits } from './utils/constants'

async function bootstrap() {
  let httpsOptions: { key: string, cert: string, ca: string, } = undefined
  if (process.env.APP_ENV === 'production') {
    const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`, 'utf8')
    const certificate = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`, 'utf8')
    const ca = fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/chain.pem`, 'utf8')
    httpsOptions = { key: privateKey, cert: certificate, ca: ca, }
  }
  const app = await NestFactory.create(AppModule, { logger: new Logger(), httpsOptions, })
  app.use(graphqlUploadExpress({ maxFileSize: InputLimits.UploadBytesMax, maxFiles: 1, }))
  await app.listen(process.env.PORT)
}
bootstrap()
