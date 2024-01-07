import { CanActivate, ExecutionContext, Injectable, NestMiddleware, } from '@nestjs/common'
import { OS, TOS } from 'src/utils/constants'
import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { ThrottlerGuard } from '@nestjs/throttler'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import { SendPushNotification, sendPushNotification } from 'src/utils/services'
import { User, UserDocument } from 'src/schemas/user.schema'
import mongoose, { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AppService {
  get(): string {
    return `STREETPASS
    `
  }

  getHelp(): string {
    return `
    `
  }

  getAbout(): string {
    return `
    `
  }

  getTOS(): string {
    return `
    `
  }

  notFound(): string {
    return `
    `
  }
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async createNotification(notification: SendPushNotification): Promise<boolean> {
    if (notification.notificationPreferences[notification.payload.type] || notification.notificationPreferences[notification.payload.type] === undefined) {
      sendPushNotification({ ...notification, payload: { ...notification.payload, }, unread: notification.unread, }).then(removeTokens => {
        if (removeTokens[OS.ios].length || removeTokens[OS.android].length) {
          this.userModel.updateOne(
            { userId: new mongoose.mongo.ObjectId(notification.userId), },
            { $pull: { 'deviceTokens.Apple': { $in: removeTokens[OS.ios], }, 'deviceTokens.Google': { $in: removeTokens[OS.android], }, }, },
          )
        }
      })
    }
    return true
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
