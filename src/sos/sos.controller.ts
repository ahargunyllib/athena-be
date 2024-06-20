import { Controller, Inject, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SosService } from './sos.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Request, Response } from 'express';
import { UserTokenDtoType } from 'src/auth/dto/token.dto';

@Controller('/api/sos')
export class SosController {
  constructor(
    private sosService: SosService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  async sendSos(
    @Req() req: Request,
    @Res() res: Response,
  ){
    await this.sosService.sendSos(
      (req.user as UserTokenDtoType).userId,
    )

    return res.status(200).json({
      statusCode: 200,
      message: 'SOS sent successfully',
      data: [],
    });
  }
}
