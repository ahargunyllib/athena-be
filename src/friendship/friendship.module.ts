import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { ChatService } from '../chat/chat.service';

@Module({
  providers: [FriendshipService, JwtStrategy, ChatService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
