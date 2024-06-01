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
import { UpdateUserDto, UpdateUserDtoType } from './dto/update-user.dto'
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
    })

    return newUser
  }

  async findAll() {
    return await this.db.user.findMany()
  }

  async findOne(userId: string) {
    return await this.db.user.findUnique({
      where: { userId },
    })
  }

  async update(userId: string, updateUserDto: UpdateUserDtoType) {
    return await this.db.user.update({
      where: { userId },
      data: updateUserDto,
    })
  }

  async remove(userId: string) {
    return await this.db.user.delete({
      where: { userId },
    })
  }
}
