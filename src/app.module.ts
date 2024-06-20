import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { AuthModule } from './auth/auth.module';
import { FriendshipModule } from './friendship/friendship.module';
import { LocationModule } from './location/location.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { SosModule } from './sos/sos.module';
import { PublicInfoModule } from './public-info/public-info.module';

@Module({
  imports: [CommonModule, AuthModule, FriendshipModule, LocationModule, ChatModule, UserModule, SosModule, PublicInfoModule],
  controllers: [],
})
export class AppModule {}
