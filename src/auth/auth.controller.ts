import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { AuthService } from './auth.service'
import { LoginDtoType } from './dto/login.dto'
import { Request, Response } from 'express'
import { LocalGuard } from './guard/local.guard'
import { JwtGuard } from './guard/jwt.guard'
import { UserTokenDtoType } from './dto/token.dto'

@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: req.user,
    })
  }

  @Post('register')
  async register(@Body() body: LoginDtoType, @Res() res: Response) {
    const data = await this.authService.register(body)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data,
    })
  }

  @Post('refresh-token')
  @UseGuards(JwtGuard)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.refreshToken(req.user as UserTokenDtoType)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data: token,
    })
  }
}
