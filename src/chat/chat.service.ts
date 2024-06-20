import { Inject, Injectable, Logger } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { PrismaService } from '../common/prisma.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Socket } from 'socket.io'
import { FriendshipStatus, MessageType } from '@prisma/client'

@Injectable()
export class ChatService {
  constructor(
    private db: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // create a new chat room
  async createChatRoom(userId: string, friendId: string) {
    const friendship = await this.db.friendship.findFirst({
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

    const chatRoom = await this.db.chatRoom.create({
      data: {
        friendshipId: friendship.friendshipId,
      },
      select: {
        chatRoomId: true,
        friendshipId: true,
        friendship: {
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
          },
        },
      },
    })

    await this.db.friendship.update({
      where: {
        friendshipId: friendship.friendshipId,
      },
      data: {
        chatRoomId: chatRoom.chatRoomId,
      },
    })

    return chatRoom
  }

  // get all chat rooms based on friendship
  async getChatRooms(userId: string) {
    const chatRoomsUser = await this.db.chatRoom.findMany({
      where: {
        friendship: {
          userId,
          status: FriendshipStatus.ACCEPTED,
        },
      },
      select: {
        chatRoomId: true,
        friendshipId: true,
        friendship: {
          select: {
            friend: {
              select: {
                userId: true,
                username: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    const chatRoomsFriend = await this.db.chatRoom.findMany({
      where: {
        friendship: {
          friendId: userId,
          status: FriendshipStatus.ACCEPTED,
        },
      },
      select: {
        chatRoomId: true,
        friendshipId: true,
        friendship: {
          select: {
            user: {
              select: {
                userId: true,
                username: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    let chatRooms = []

    for (const chatRoom of chatRoomsUser) {
      const cr = {
        chatRoomId: chatRoom.chatRoomId,
        friendshipId: chatRoom.friendshipId,
        friend: chatRoom.friendship.friend,
      }

      chatRooms.push(cr)
    }

    for (const chatRoom of chatRoomsFriend) {
      const cr = {
        chatRoomId: chatRoom.chatRoomId,
        friendshipId: chatRoom.friendshipId,
        friend: chatRoom.friendship.user,
      }

      chatRooms.push(cr)
    }

    return chatRooms
  }

  // create message to a chat room
  async createMessage(
    chatRoomId: string,
    senderId: string,
    content: string,
    type: MessageType,
  ) {
    const message = await this.db.message.create({
      data: {
        chatRoomId: chatRoomId,
        senderId: senderId,
        content: content,
        type: type,
      },
    })

    return message
  }

  // get all messages based on chat room
  async getAllMessages(chatRoomId: string) {
    const messages = await this.db.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      select: {
        messageId: true,
        chatRoomId: true,
        senderId: true,
        content: true,
        type: true,
        createdAt: true,
        sender: {
          select: {
            userId: true,
            username: true,
            fullName: true,
            imageUrl: true,
          },
        },
      },
    })

    return messages
  }
}
