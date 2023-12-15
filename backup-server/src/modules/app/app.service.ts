import { CallHandler, CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor, NestMiddleware, SetMetadata } from '@nestjs/common'
import { TOS } from 'src/utils/constants'
import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { ThrottlerGuard } from '@nestjs/throttler'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

const font = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap" rel="stylesheet" />'
const fontSizeS = 20
const fontSize = 26
const iconSize = 128
const title = (path: string, color: string = 'black') => `<a href="${path}" style="text-decoration: none; color: ${color}; font-size: 38px; font-weight: 900;">k i t e</a>`
const iosIcon = `
  <div style="width: ${iconSize}; height: ${iconSize};">
    <a href="https://apps.apple.com/app/${process.env.APPLE_APP_STORE_ID}">
      <img src="/media/icon-l.png" alt="" width="${iconSize}" style="position: absolute; z-index: 2; border-radius: ${iconSize / 4.2}px; background-color: transparent;">
      <img src="/media/icon-m.png" alt="" width="${iconSize}" style="position: absolute; z-index: 1; border-radius: ${iconSize / 4.2}px; background-color: transparent;">
      <img src="/media/icon-s.png" alt="" width="${iconSize}" style="position: absolute; z-index: 0; border-radius: ${iconSize / 4.2}px; box-shadow: 0 12px 16px 0 rgba(0,0,0,0.23);">
    </a>
  </div>
`
const androidIcon = `
  <div style="width: ${iconSize}; height: ${iconSize};">
    <a href="">
      <img src="/media/null-icon-l.png" alt="" width="${iconSize}" style="position: absolute; z-index: 2; border-radius: 64px; background-color: transparent;">
      <img src="/media/null-icon-m.png" alt="" width="${iconSize}" style="position: absolute; z-index: 1; border-radius: 64px; background-color: transparent;">
      <img src="/media/null-icon-s.png" alt="" width="${iconSize}" style="position: absolute; z-index: 0; border-radius: 64px; box-shadow: 0 12px 16px 0 rgba(0,0,0,0.23);">
    </a>
  </div>
`
const video = 'https://kite-case.s3.us-east-2.amazonaws.com/landing.mp4'
const icons = (color: string = 'black') => `
  <div style="width: 100%; display: flex; flex-direction: row; justify-content: center; z-index: 1;">
    <div style="display: flex; flex: 1; justify-content: flex-end;">
      <div style="display: flex; align-items: flex-end; flex-direction: column; margin-right: 8%;">
        ${iosIcon}
        <p style="font-size: ${fontSize}px; font-weight: 900; text-align: center; width: 100%; color: ${color};">
          iOS
        </p>
      </div>
    </div>

    <div style="display: flex; flex: 1;">
      <div style="display: flex; align-items: flex-start; flex-direction: column; margin-left: 8%;">
        ${androidIcon}
        <p style="font-size: ${fontSize}px; font-weight: 900; text-align: center; width: 100%; color: ${color};">
          Android<br>
          <a style="font-size: ${fontSizeS}px; font-weight: 900; text-align: center; width: 100%; color: ${color};">
            (coming soon)
          </a>
        </p>
      </div>
    </div>
  </div>
`
const copyright = `<div style="position: absolute; bottom: 8px; opacity: 0.2; font-weight: 100; z-index: 1;">© 2023 Kite App Inc. All rights reserved.</div>`
const html = `
  <html lang="en">
  <meta charset="UTF-8">
  <title>k i t e</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  </style>
  ${font}
`

@Injectable()
export class AppService {
  get(): string {
    return `
      ${html}
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #F8F8FF;
        font-family: 'Inter', sans-serif;
      ">
        <img
          src="/media/thumbnail.png" alt=""
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: 0;
            transform: translateX(-50%) translateY(-50%);
          "
        >
        <video
          playsinline autoplay muted loop poster preload="auto"
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: 0;
            transform: translateX(-50%) translateY(-50%);
          "
        >
          <source src="${video}" type="video/mp4">
        </video>
        <div style="z-index: 1;">
          <p style="font-size: ${fontSize}px; text-align: center;">
            ${title('/about', 'white')}
          </p>
        </div>
        ${icons('white')}
        ${copyright}
      </div>
    `
  }

  getHelp(): string {
    return `
      ${html}
      <div style="
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #F8F8FF;
        font-family: 'Inter', sans-serif;
      ">
        <div>
          <p style="font-size: ${fontSize}px; text-align: center;">
            ${title('/')}
            <br><br><a href="mailto: help@usekite.app" style="text-decoration: none;">Send us an email</a> and we'll get back to you asap.
          </p>
        </div>
        ${copyright}
      </div>
    `
  }

  getAbout(): string {
    return `
      ${html}
      <div style="
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #F8F8FF;
        font-family: 'Inter', sans-serif;
      ">
        <div style="padding: 0 64px;">
          <p style="font-size: ${fontSize}px; text-align: center;">
            ${title('/')}
            <br><br>Welcome to kite, a new social media platform.
            <br><br>Share moments of your life wherever you go.
            <br>Connect with people nearby through StreetPass.
            <br>Invite friends and make unforgettable memories around the 🌎 one adventure at a time.
            <br><br>Made in Vancouver, Canada.
          </p>
        </div>
        ${(icons())}
        ${copyright}
      </div>
    `
  }

  getTOS(): string {
    return `
      ${html}
      <div style="
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #F8F8FF;
        font-family: 'Inter', sans-serif;
      ">
        <div style="max-height: 80vh; overflow: auto;padding: 0 64px;">
          <p style="font-size: 18px; text-align: center;">
            ${title('/')}
            <br><br>${TOS}
          </p>
        </div>
        ${copyright}
      </div>
    `
  }

  notFound(): string {
    return `
      ${html}
      <div style="
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #F8F8FF;
        font-family: 'Inter', sans-serif;
      ">
        <div>
          <p style="font-size: ${fontSize}px; text-align: center;">
            ${title('/')}
          </p>
        </div>
        ${copyright}
      </div>
    `
  }
}

@Injectable()
export class GqlRateLimitGuard extends ThrottlerGuard implements CanActivate {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext()
    return { req: ctx.req, res: ctx.res }
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(context.getClass() instanceof GraphQLModule)) return true
    return super.canActivate(context)
  }
}

@Injectable()
export class RateLimitGuard implements NestMiddleware {
  private readonly limiter: ReturnType<typeof rateLimit>
  constructor(windowMs: number, max: number) { this.limiter = rateLimit({ windowMs, max, }) }
  use(req: Request, res: Response, next: NextFunction) { this.limiter(req, res, next) }
}
export function createRateLimitGuard(windowMs: number, max: number) {
  const guard = new RateLimitGuard(windowMs, max)
  return (req: Request, res: Response, next: NextFunction) => guard.use(req, res, next)
}

@Injectable()
export class BlacklistGuard implements NestMiddleware {
  private readonly limiter: ReturnType<typeof rateLimit>
  private static blacklistedIps: Set<string> = new Set()
  constructor(windowMs: number, max: number) {
    this.limiter = rateLimit({
      windowMs,
      max,
      handler: (req: Request, res: Response) => {
        const ip = req.ip
        if (!BlacklistGuard.blacklistedIps.has(ip)) BlacklistGuard.blacklistedIps.add(ip)
        res.status(429)
      },
      skip: (req: Request) => BlacklistGuard.blacklistedIps.has(req.ip),
    })
  }
  use(req: Request, res: Response, next: NextFunction) {
    if (BlacklistGuard.blacklistedIps.has(req.ip)) return res.status(403).send('Banned')
    this.limiter(req, res, next)
  }
}
export function createBlacklistGuard(windowMs: number, max: number) {
  const guard = new BlacklistGuard(windowMs, max)
  return (req: Request, res: Response, next: NextFunction) => guard.use(req, res, next)
}

// @Injectable()
// export class TimeoutInterceptor implements NestInterceptor {
//   constructor(private readonly reflector: Reflector) {}

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const timeout = this.reflector.get<number>('timeout', context.getHandler())
//     if (timeout) {
//       const httpContext = context.switchToHttp();
//       const request = httpContext.getRequest();
//       if (!request) {
//         const gqlContext = context.getArgByIndex(2);
//         if (gqlContext && gqlContext.req) {
//           gqlContext.req.socket.setTimeout(timeout);
//         }
//       } else if (request.socket) {
//         request.socket.setTimeout(timeout);
//       }
//     }
//     return next.handle()
//   }
// }
// export const Timeout = (seconds: number) => SetMetadata('timeout', seconds * 1000)
