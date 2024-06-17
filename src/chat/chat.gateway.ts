import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { JwtService } from '@nestjs/jwt'
import { Inject, Logger } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { MessageType } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  handleDisconnect(client: any) {
    this.logger.debug(`Client ${client.id} disconnected`)
  }

  async handleConnection(client: any) {
    this.logger.debug(`Client ${client.id} connected`)

    try {
      const token = client.handshake.query.token
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      client.data.userId = decoded.userId
      this.logger.debug(`Client ${client.id} authenticated as ${decoded.username}`)
    } catch (error) {
      this.logger.error(
        `Invalid token for client ${client.id}. ${error.message}`,
      )
      client.disconnect()
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { chatRoomId: string }): void {
    client.join(payload.chatRoomId)
    this.logger.debug(`Client ${client.id} joined room ${payload.chatRoomId}`)
  }

  @SubscribeMessage('exitRoom')
  handleExitRoom(client: Socket, payload: { chatRoomId: string }): void {
    client.leave(payload.chatRoomId)
    this.logger.debug(`Client ${client.id} left room ${payload.chatRoomId}`)
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { chatRoomId: string; message: string; type: string },
  ): Promise<void> {
    this.logger.debug(
      `Message from client ${client.id} to room ${payload.chatRoomId}: ${payload.message}`,
    )

    const userId = client.data.userId
    this.server.to(payload.chatRoomId).emit('message', {
      userId,
      message: payload.message,
      type: payload.type,
    })

    let messageType: MessageType = MessageType.TEXT
    switch (payload.type) {
      case 'image':
        messageType = MessageType.IMAGE
        break
      case 'video':
        messageType = MessageType.VIDEO
        break
      case 'audio':
        messageType = MessageType.AUDIO
        break
    }

    await this.chatService.createMessage(
      payload.chatRoomId,
      userId,
      payload.message,
      messageType,
    )
  }
}
