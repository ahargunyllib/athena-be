import { PrismaClient, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

const db = new PrismaClient()

async function main() {
  const users = Array.from({ length: 10 }).map(() => ({
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    username: faker.person.middleName(),
    dateOfBirth: faker.date.past().toISOString(),
    phoneNumber: faker.phone.number().toString(),
    password: faker.internet.password()
  }))

  await db.user.createMany({
    data: users,
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
