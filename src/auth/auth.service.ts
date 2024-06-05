import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { LoginDtoType, loginSchema } from './dto/login.dto'
import { PrismaService } from '../common/prisma.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { ValidationService } from '../common/validation.service'
import { JwtService } from '@nestjs/jwt'
import {
  RegisterDto,
  RegisterDtoType,
  registerSchema,
} from './dto/register.dto'
import * as bcrypt from 'bcrypt'
import { UserTokenDTO, UserTokenDtoType } from './dto/token.dto'

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async login(loginDto: LoginDtoType) {
    const validatedDto = this.validationService.validate(loginSchema, loginDto)

    const user = await this.db.user.findUnique({
      where: { email: validatedDto.email },
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const isMatch = await bcrypt.compare(validatedDto.password, user.password)
    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST)
    }

    const token = this.jwtService.sign({
      userId: user.userId,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
    })

    return {
      token,
      user: {
        userId: user.userId,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    }
  }

  async register(registerDto: RegisterDtoType) {
    const validatedDto = this.validationService.validate(
      registerSchema,
      registerDto,
    )

    let user = await this.db.user.findUnique({
      where: { email: validatedDto.email },
    })

    if (!user) {
      user = await this.db.user.findUnique({
        where: { username: validatedDto.username },
      })
    }

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    validatedDto.password = await bcrypt.hash(validatedDto.password, 10)

    const newUser = await this.db.user.create({
      data: new RegisterDto(validatedDto),
      select: {
        userId: true,
        fullName: true,
        username: true,
        email: true,
        phoneNumber: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return newUser
  }

  async refreshToken(user: UserTokenDtoType) {
    const newToken = this.jwtService.sign(user)

    return newToken
  }
}
