import { Controller, Delete, Get, HttpStatus, Inject, Logger, Post, Req, Res, UseGuards } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Request, Response } from 'express'
import { UserTokenDtoType } from '../auth/dto/token.dto'
import { FriendshipService } from './friendship.service'
import { JwtGuard } from '../auth/guard/jwt.guard'

@Controller('/api/friendship')
export class FriendshipController {
  constructor(
    private friendshipService: FriendshipService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('list')
  @UseGuards(JwtGuard)
  async getFriendList(@Req() req: Request, @Res() res: Response) {
    const data = await this.friendshipService.getFriendList((req.user as UserTokenDtoType).userId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Friend list retrieved successfully',
      data,
    })
  }

  @Post('add/:friendId')
  @UseGuards(JwtGuard)
  async addFriend(@Req() req: Request, @Res() res: Response) {
    const data = await this.friendshipService.addFriend((req.user as UserTokenDtoType).userId, req.params.friendId)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Friend added successfully',
      data,
    })
  }

  @Delete('remove/:friendId')
  @UseGuards(JwtGuard)
  async removeFriend(@Req() req: Request, @Res() res: Response) {
    await this.friendshipService.removeFriend((req.user as UserTokenDtoType).userId, req.params.friendId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Friend removed successfully',
      data: [],
    })
  }

  @Post('accept/:friendId')
  @UseGuards(JwtGuard)
  async acceptFriend(@Req() req: Request, @Res() res: Response) {
    await this.friendshipService.acceptFriend((req.user as UserTokenDtoType).userId, req.params.friendId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Friend request accepted successfully',
      data: [],
    })
  }

  @Delete('reject/:friendId')
  @UseGuards(JwtGuard)
  async rejectFriend(@Req() req: Request, @Res() res: Response) {
    await this.friendshipService.rejectFriend((req.user as UserTokenDtoType).userId, req.params.friendId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Friend request rejected successfully',
      data: [],
    })
  }

  @Get('search')
  @UseGuards(JwtGuard)
  async searchUser(@Req() req: Request, @Res() res: Response) {
    const data = await this.friendshipService.searchUser(req.query.username as string, (req.user as UserTokenDtoType).userId)

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User found successfully',
      data,
    })
  }
}
