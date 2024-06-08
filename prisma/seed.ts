import { PrismaClient, User } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
  const billy = await db.user.create({
    data: {
      email: 'billy@gmail.com',
      fullName: 'Billy',
      username: 'billy',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  const selvi = await db.user.create({
    data: {
      email: 'selvi@gmail.com',
      fullName: 'Selvi',
      username: 'selvi',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  const alfredo = await db.user.create({
    data: {
      email: 'alfredo@gmail.com',
      fullName: 'Alfredo',
      username: 'alfredo',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  const bagas = await db.user.create({
    data: {
      email: 'bagas@gmail.com',
      fullName: 'Bagas',
      username: 'bagas',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  const _danish = await db.user.create({
    data: {
      email: 'danish@gmail.com',
      fullName: 'Danish',
      username: 'danish',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  const aufii = await db.user.create({
    data: {
      email: 'aufii@gmail.com',
      fullName: 'Aufii',
      username: 'aufii',
      dateOfBirth: faker.date.past().toISOString(),
      phoneNumber: faker.phone.number().toString(),
      password: await bcrypt.hash('123456', 10),
    },
  })

  await db.friendship.create({
    data: {
      userId: billy.userId,
      friendId: selvi.userId,
      status: 'ACCEPTED',
    },
  })

  await db.friendship.create({
    data: {
      userId: aufii.userId,
      friendId: billy.userId,
      status: 'ACCEPTED',
    },
  })

  await db.friendship.create({
    data: {
      userId: billy.userId,
      friendId: alfredo.userId,
      status: 'PENDING',
    },
  })

  await db.friendship.create({
    data: {
      userId: bagas.userId,
      friendId: billy.userId,
      status: 'PENDING',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
