import { Body, Controller, Get, HttpStatus, Inject, Logger, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Request, Response } from 'express';
import { UserTokenDtoType } from 'src/auth/dto/token.dto';
import { UpdateLocationDtoType } from './dto/updateLocation.dto';

@Controller('/api/location')
export class LocationController {
  constructor(
    private locationService: LocationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('friends')
  @UseGuards(JwtGuard)
  async getFriendsLocation(@Req() req: Request, @Res() res: Response) {
    const data = await this.locationService.getFriendsLocation((req.user as UserTokenDtoType).userId);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Friend location retrieved successfully',
      data,
    });
  }

  @Patch('update')
  @UseGuards(JwtGuard)
  async updateLocation(@Req() req: Request, @Res() res: Response, @Body() body: UpdateLocationDtoType) {
    await this.locationService.updateLocation(
      (req.user as UserTokenDtoType).userId,
      body
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Location updated successfully',
      data: [],
    });
  }
}
