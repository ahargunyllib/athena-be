import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [CommonModule, AuthModule, FriendshipModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
