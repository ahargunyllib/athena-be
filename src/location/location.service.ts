import { Inject, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import {
  UpdateLocationDto,
  UpdateLocationDtoType,
  updateLocationSchema,
} from './dto/updateLocation.dto'
import { ValidationService } from '../common/validation.service'
import { FriendshipStatus } from '@prisma/client'

@Injectable()
export class LocationService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getFriendsLocation(userId: string) {
    // 3 Condition to show
    // 1. User send friend request to friend and status is ACCEPTED
    // 2. Friend send friend request to user and status is ACCEPTED
    // 3. Friend send friend request to user and status is PENDING, so user can accept or reject it

    const friendRequests = await this.db.friendship.findMany({
      where: {
        OR: [
          {
            friendId: userId,
            status: FriendshipStatus.ACCEPTED,
          },
        ],
      },
      select: {
        user: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    })

    const userRequests = await this.db.friendship.findMany({
      where: {
        userId: userId,
        status: FriendshipStatus.ACCEPTED,
      },
      select: {
        friend: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    })

    let friends = friendRequests.map((friendRequest) => {
      return {
        userId: friendRequest.user.userId,
        username: friendRequest.user.username,
        fullName: friendRequest.user.fullName,
        latitude: friendRequest.user.latitude,
        longitude: friendRequest.user.longitude,
      }
    })

    friends = friends.concat(
      userRequests.map((userRequest) => {
        return {
          userId: userRequest.friend.userId,
          username: userRequest.friend.username,
          fullName: userRequest.friend.fullName,
          latitude: userRequest.friend.latitude,
          longitude: userRequest.friend.longitude,
        }
      }),
    )

    return friends
  }
  async updateLocation(
    userId: string,
    updateLocationDto: UpdateLocationDtoType,
  ) {
    const validatedDto = this.validationService.validate(
      updateLocationSchema,
      updateLocationDto,
    )

    const data = new UpdateLocationDto(validatedDto)

    // Update user location
    return await this.db.user.update({
      where: {
        userId: userId,
      },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })
  }
}
