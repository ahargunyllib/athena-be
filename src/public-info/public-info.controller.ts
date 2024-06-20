import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { PublicInfoService } from './public-info.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { JwtGuard } from 'src/auth/guard/jwt.guard'
import { Request, Response } from 'express'
import { UserTokenDtoType } from 'src/auth/dto/token.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreatePublicInfoDto, CreatePublicInfoDtoType } from './dto/create.dto'

@Controller('/api/public-info')
export class PublicInfoController {
  constructor(
    private publicInfoService: PublicInfoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getPublicInfo(@Req() _req: Request, @Res() res: Response) {
    const data = await this.publicInfoService.getPublicInfo()

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Public info retrieved successfully',
      data,
    })
  }

  @Get(':publicInformationId')
  @UseGuards(JwtGuard)
  async getPublicInfoById(@Req() req: Request, @Res() res: Response) {
    const data = await this.publicInfoService.getPublicInfoById(
      req.params.publicInformationId,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Public info retrieved successfully',
      data,
    })
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async createPublicInfo(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    await this.publicInfoService.createPublicInfo(
      (req.user as UserTokenDtoType).userId,
      {
        latitude: Number(req.body.latitude),
        longitude: Number(req.body.longitude),
        content: req.body.content as string,
      } as CreatePublicInfoDtoType,
      avatar,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Public info created successfully',
      data: [],
    })
  }

  @Post(':publicInformationId/comment')
  @UseGuards(JwtGuard)
  async createComment(@Req() req: Request, @Res() res: Response) {
    await this.publicInfoService.createComment(
      (req.user as UserTokenDtoType).userId,
      req.body,
      req.params.publicInformationId,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Comment created successfully',
      data: [],
    })
  }

  @Post(':publicInformationId/report')
  @UseGuards(JwtGuard)
  async reportPublicInfo(@Req() req: Request, @Res() res: Response) {
    await this.publicInfoService.reportPublicInfo(
      (req.user as UserTokenDtoType).userId,
      req.body,
      req.params.publicInformationId,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Public info reported successfully',
      data: [],
    })
  }
}
