import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { PrismaService } from '../common/prisma.service'
import { ValidationService } from '../common/validation.service'
import { UpdateCredentialsDtoType, UpdateUserDtoType, updateCredentialsSchema, updateUserSchema } from './dto/update.dto'
import { MulterService } from '../common/multer.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    private multerService: MulterService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUserProfile(userId: string) {
    const userProfile = await this.db.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        username: true,
        fullName: true,
        email: true,
        imageUrl: true,
      },
    })

    return userProfile
  }

  async updateUserProfile(
    userId: string,
    updateDto: UpdateUserDtoType,
    file: Express.Multer.File,
  ) {
    const validatedDto = this.validationService.validate(
      updateUserSchema,
      updateDto,
    )

    const oldUser = await this.db.user.findUnique({
      where: {
        userId,
      },
    })

    let imageUrl = oldUser.imageUrl

    if (validatedDto.username) {
      const user = await this.db.user.findUnique({
        where: {
          username: validatedDto.username,
        },
      })

      if (user && user.userId !== userId) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        )
      }
    }

    if (file) {
      const filename = validatedDto.username
        ? validatedDto.username
        : oldUser.username
      const extension = file.originalname.split('.').pop()

      imageUrl = await this.multerService.uploadFile(
        file,
        filename + '.' + extension,
      )
    }

    return await this.db.user.update({
      where: {
        userId,
      },
      data: { ...validatedDto, imageUrl },
      select: {
        userId: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        dateOfBirth: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async updateUserCredentials(
    userId: string,
    updateDto: UpdateCredentialsDtoType,
  ) {
    const validatedDto = this.validationService.validate(
      updateCredentialsSchema,
      updateDto,
    )

    const user = await this.db.user.findUnique({
      where: {
        email: validatedDto.email,
      },
    })

    if (user && user.userId !== userId) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    }

    validatedDto.password = await bcrypt.hash(validatedDto.password, 10)

    return await this.db.user.update({
      where: {
        userId,
      },
      data: validatedDto,
      select: {
        userId: true,
        email: true,
        username: true,
        fullName: true,
        phoneNumber: true,
        dateOfBirth: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}
