import { CallHandler, CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor, NestMiddleware, SetMetadata } from '@nestjs/common'
import { TOS } from 'src/utils/constants'
import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import { ThrottlerGuard } from '@nestjs/throttler'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

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
