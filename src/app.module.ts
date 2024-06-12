import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module';
import { FriendshipModule } from './friendship/friendship.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [CommonModule, AuthModule, FriendshipModule, LocationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
