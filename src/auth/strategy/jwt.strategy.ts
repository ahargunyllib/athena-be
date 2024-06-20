import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserTokenDtoType } from '../dto/token.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  validate(payload: any) {
    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      dateOfBirth: payload.dateOfBirth,
      imageUrl: payload.imageUrl,
    }
  }
}
