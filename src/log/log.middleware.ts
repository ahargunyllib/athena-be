import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { Logger } from 'winston'

@Injectable()
export class LogMiddleware implements NestMiddleware<Request, Response> {
  constructor(@Inject('LogService') private readonly logger: Logger) {}

  use(req: Request, _res: Response, next: () => void) {
    this.logger.info(`Request: ${req.method} ${req.url}`)
    next()
  }
}
