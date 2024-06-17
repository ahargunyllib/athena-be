import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { JwtGuard } from '../auth/guard/jwt.guard'
import { Request, Response } from 'express'

@Controller('/api/user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/:userId')
  @UseGuards(JwtGuard)
  async getUserProfile(@Req() req: Request, @Res() res: Response) {
    const data = await this.userService.getUserProfile(req.params.userId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User profile retrieved successfully',
      data,
    })
  }
}
