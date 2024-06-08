import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

@Injectable()
export class TestService {
  constructor(private db: PrismaService) {}

  async deleteAll() {
    await this.deleteFriendship()
    await this.deleteUser()
  }

  async deleteUser() {
    await this.db.user.deleteMany({})
  }

  async deleteFriendship() {
    await this.db.friendship.deleteMany({})
  }

  async createUser() {
    await this.db.user.create({
      data: {
        email: 'billy@gmail.com',
        fullName: 'Billy',
        username: 'billy',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })

    await this.db.user.create({
      data: {
        email: 'selvi@gmail.com',
        fullName: 'Selvi',
        username: 'selvi',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })

    await this.db.user.create({
      data: {
        email: 'alfredo@gmail.com',
        fullName: 'Alfredo',
        username: 'alfredo',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })

    await this.db.user.create({
      data: {
        email: 'bagas@gmail.com',
        fullName: 'Bagas',
        username: 'bagas',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })

    await this.db.user.create({
      data: {
        email: 'danish@gmail.com',
        fullName: 'Danish',
        username: 'danish',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })

    await this.db.user.create({
      data: {
        email: 'aufii@gmail.com',
        fullName: 'Aufii',
        username: 'aufii',
        dateOfBirth: faker.date.past().toISOString(),
        phoneNumber: faker.phone.number().toString(),
        password: await bcrypt.hash('123456', 10),
      },
    })
  }

  async createFriendship() {
    const billy = await this.getUser('billy')
    const selvi = await this.getUser('selvi')
    const alfredo = await this.getUser('alfredo')
    const bagas = await this.getUser('bagas')
    const aufii = await this.getUser('aufii')

    await this.db.friendship.create({
      data: {
        userId: billy.userId,
        friendId: selvi.userId,
        status: 'ACCEPTED',
      },
    })

    await this.db.friendship.create({
      data: {
        userId: aufii.userId,
        friendId: billy.userId,
        status: 'ACCEPTED',
      },
    })

    await this.db.friendship.create({
      data: {
        userId: billy.userId,
        friendId: alfredo.userId,
        status: 'PENDING',
      },
    })

    await this.db.friendship.create({
      data: {
        userId: bagas.userId,
        friendId: billy.userId,
        status: 'PENDING',
      },
    })
  }

  async getUser(username: string) {
    return this.db.user.findUnique({
      where: { username },
    })
  }
}
