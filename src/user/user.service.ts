import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ){}

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
      },
    })

    return userProfile
  }
}
