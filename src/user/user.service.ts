import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import {
  CreateUserDto,
  CreateUserDtoType,
  createUserSchema,
} from './dto/create-user.dto'
import { UpdateUserDto, UpdateUserDtoType, updateUserSchema } from './dto/update-user.dto'
import { PrismaService } from '../common/prisma.service'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { ValidationService } from '../common/validation.service'

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDtoType) {
    const validatedDto = this.validationService.validate(
      createUserSchema,
      createUserDto,
    )

    const user = await this.db.user.findUnique({
      where: { email: validatedDto.email },
    })

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST)
    }

    const newUser = await this.db.user.create({
      data: new CreateUserDto(validatedDto),
      select: {
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return newUser
  }

  async findAll() {
    return await this.db.user.findMany({
      select: {
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findOne(userId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return user
  }

  async update(userId: string, updateUserDto: UpdateUserDtoType) {
    const user = await this.db.user.findUnique({
      where: { userId },
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const validatedDto = this.validationService.validate(updateUserSchema, updateUserDto)

    return await this.db.user.update({
      where: { userId },
      data: validatedDto,
      select: {
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async remove(userId: string) {
    const user = await this.db.user.findUnique({
      where: { userId },
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return await this.db.user.delete({
      where: { userId },
    })
  }
}
