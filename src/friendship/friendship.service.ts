import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { PrismaService } from '../common/prisma.service'
import { FriendshipStatus } from '@prisma/client'

@Injectable()
export class FriendshipService {
  constructor(
    private db: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getFriendList(userId: string) {
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
          {
            friendId: userId,
            status: FriendshipStatus.PENDING,
          },
        ],
      },
      select: {
        user: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            imageUrl: true,
          },
        },
        status: true,
      }
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
            imageUrl: true,
          },
        },
        status: true,
      }
    })

    let friends = friendRequests.map((friendRequest) => {
      return {
        userId: friendRequest.user.userId,
        username: friendRequest.user.username,
        fullName: friendRequest.user.fullName,
        status: friendRequest.status,
        imageUrl: friendRequest.user.imageUrl,
      }
    })

    friends = friends.concat(userRequests.map((userRequest) => {
      return {
        userId: userRequest.friend.userId,
        username: userRequest.friend.username,
        fullName: userRequest.friend.fullName,
        status: userRequest.status,
        imageUrl: userRequest.friend.imageUrl,
      }
    }))

    return friends
  }

  async addFriend(userId: string, friendId: string) {
    const friendAddUser = await this.db.friendship.findFirst({
      where: {
        userId: friendId,
        friendId: userId,
      },
    })

    const userAddFriend = await this.db.friendship.findFirst({
      where: {
        userId,
        friendId,
      },
    })

    // if userAddFriend or friendAddUser and status is ACCEPTED
    if (
      userAddFriend?.status === FriendshipStatus.ACCEPTED ||
      friendAddUser?.status === FriendshipStatus.ACCEPTED
    ) {
      throw new HttpException('User already friend', HttpStatus.BAD_REQUEST)
    }

    // if user already sent friend request to friend
    if (userAddFriend) {
      throw new HttpException(
        'Friend request already sent',
        HttpStatus.BAD_REQUEST,
      )
    }

    // if friend already sent friend request to user, so it means both of them want to be friend, so just accept it
    if (friendAddUser) {
      await this.db.friendship.updateMany({
        where: {
          userId: friendId,
          friendId: userId,
        },
        data: {
          status: FriendshipStatus.ACCEPTED,
        },
      })

      return await this.db.friendship.findFirst({
        where: {
          userId: friendId,
          friendId: userId,
        },
        select: {
          user: {
            select: {
              userId: true,
              username: true,
              fullName: true,
            },
          },
          friend: {
            select: {
              userId: true,
              username: true,
              fullName: true,
            },
          },
          status: true,
        },
      })
    }

    // if user and friend not friend yet, create new friendship
    return await this.db.friendship.create({
      data: {
        userId,
        friendId,
        status: FriendshipStatus.PENDING,
      },
      select: {
        user: {
          select: {
            userId: true,
            username: true,
            fullName: true,
          },
        },
        friend: {
          select: {
            userId: true,
            username: true,
            fullName: true,
          },
        },
        status: true,
      },
    })
  }

  // hanya bisa remove friend jika statusnya ACCEPTED
  async removeFriend(userId: string, friendId: string) {
    return await this.db.friendship.deleteMany({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    })
  }

  // hanya bisa accept friend jika statusnya PENDING dan kita yang di add
  async acceptFriend(userId: string, friendId: string) {
    return await this.db.friendship.updateMany({
      where: {
        userId: friendId,
        friendId: userId,
      },
      data: {
        status: FriendshipStatus.ACCEPTED,
      },
    })
  }

  // hanya bisa reject friend jika statusnya PENDING dan kita yang di add
  async rejectFriend(userId: string, friendId: string) {
    return await this.db.friendship.deleteMany({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    })
  }

  async searchUser(username: string, userId: string) {
    // find user with username == username
    // check if user is already friend with userId

    const user = await this.db.user.findUnique({
      where: {
        username,
      },
      select: {
        userId: true,
        username: true,
        fullName: true,
        imageUrl: true,
      },
    })

    if (!user) {
      return []
    }

    const friendship = await this.db.friendship.findFirst({
      where: {
        OR: [
          {
            userId,
            friendId: user.userId,
          },
          {
            userId: user.userId,
            friendId: userId,
          },
        ],
      },
    })

    if (friendship) {
      return []
    }

    return [user]
  }
}
