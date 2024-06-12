import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  controllers: [LocationController],
  providers: [LocationService, JwtStrategy]
})
export class LocationModule {}
