import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  providers: [FriendshipService, JwtStrategy],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
