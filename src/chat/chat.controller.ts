import { Controller, Get, HttpStatus, Inject, Logger, Req, Res, UseGuards } from '@nestjs/common'
import { ChatService } from './chat.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { JwtGuard } from '../auth/guard/jwt.guard'
import { UserTokenDtoType } from '../auth/dto/token.dto'
import { Request, Response } from 'express'

@Controller('/api/chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('room')
  @UseGuards(JwtGuard)
  async getChatList(@Req() req: Request, @Res() res: Response) {
    const data = await this.chatService.getChatRooms(
      (req.user as UserTokenDtoType).userId,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Chat list retrieved successfully',
      data,
    })
  }

  @Get('room/:roomId')
  @UseGuards(JwtGuard)
  async getChatMessages(@Req() req: Request, @Res() res: Response) {
    const data = await this.chatService.getAllMessages(
      req.params.roomId,
    )

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Chat messages retrieved successfully',
      data,
    })
  }
}
