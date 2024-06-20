import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { JwtGuard } from '../auth/guard/jwt.guard'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserTokenDtoType } from '../auth/dto/token.dto'
import { UpdateUserDtoType } from './dto/update.dto'

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

  @Put('/update')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserProfile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const data = await this.userService.updateUserProfile(
      (req.user as UserTokenDtoType).userId,
      req.body,
      avatar,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User profile updated successfully',
      data,
    })
  }
}
