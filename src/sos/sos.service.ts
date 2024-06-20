import { Inject, Injectable, Logger } from '@nestjs/common'
import { FriendshipStatus, MessageType } from '@prisma/client'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { PrismaService } from '../common/prisma.service'
import { ChatService } from '../chat/chat.service'

@Injectable()
export class SosService {
  constructor(
    private db: PrismaService,
    private chatService: ChatService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendSos(userId: string) {
    const chatRooms = await this.chatService.getChatRooms(userId)

    const { fullName, latitude, longitude } = await this.db.user.findUnique({
      where: {
        userId,
      },
      select: {
        fullName: true,
        latitude: true,
        longitude: true,
      },
    })

    const address = 'TO BE DETERMINED'

    const message = `_______________________________________

EMERGENCY! Need Help!
Location: ${address} (${latitude}, ${longitude})
I am in an emergency situation. Need help immediately!
${fullName}
_______________________________________
This message contains the essential information in a brief and clear manner to facilitate a quick response from the recipient.
    `

    // for every chat room, create a message
    for (const chatRoom of chatRooms) {
      await this.chatService.createMessage(
        chatRoom.chatRoomId,
        userId,
        message,
        MessageType.TEXT,
      )
    }
  }
}
