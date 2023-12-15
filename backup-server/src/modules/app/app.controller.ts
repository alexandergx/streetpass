import { Controller, Get, Header, Param, Res, } from '@nestjs/common'
import { AppService, } from './app.service'
import { createReadStream, readFileSync, } from 'fs'
import { join, extname, } from 'path'
import { Response } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): string {
    return this.appService.get()
  }

  @Get('help')
  getHelp(): string {
    return this.appService.getHelp()
  }

  @Get('about')
  getAbout(): string {
    return this.appService.getAbout()
  }

  @Get('tos')
  getTOS(): string {
    return this.appService.getTOS()
  }

  @Get('media/:filename')
  serveMedia(@Param('filename') filename: string, @Res() res: Response): void {
    const ext = extname(filename)
    let contentType: string
    switch (ext) {
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.mp4':
        contentType = 'video/mp4'
        break
      default:
        res.status(400).send('Unsupported file type')
        return
    }
    const mediaPath = process.env.APP_ENV === 'production'
      ? join(process.cwd(), 'dist/assets/media', filename)
      : join(process.cwd(), 'src/assets/media', filename)
    res.setHeader('Content-Type', contentType)
    createReadStream(mediaPath).pipe(res)
  }

  @Get('.well-known/apple-app-site-association')
  @Header('Content-Type', 'application/json')
  wellKnown(): string {
    const filePath = join(process.cwd(), '.well-known', 'apple-app-site-association')
    const aasaContent = readFileSync(filePath, 'utf8')
    return aasaContent
  }

  @Get(process.env.APP_ENV !== 'production' ? '404' : '*')
  notFound(): string {
    return this.appService.notFound()
  }
}
