import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class TestService {
  constructor(private db: PrismaService) {}

  async deleteAll() {
    await this.deleteUser()
  }

  async deleteUser() {
    await this.db.user.deleteMany({
      where: { fullName: 'test' },
    })
  }
}
