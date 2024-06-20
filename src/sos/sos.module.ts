import { Module } from '@nestjs/common'
import { SosController } from './sos.controller'
import { SosService } from './sos.service'
import { ChatService } from '../chat/chat.service'

@Module({
  controllers: [SosController],
  providers: [SosService, ChatService],
})
export class SosModule {}
