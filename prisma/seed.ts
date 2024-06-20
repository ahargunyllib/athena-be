import { MessageType, PrismaClient, User } from '@prisma/client'
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
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
      latitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[0],
      longitude: faker.location.nearbyGPSCoordinate({
        origin: [-7.9355808, 112.6274864],
        radius: 1,
        isMetric: true
      })[1],
      imageUrl: "https://athena-img.s3.ap-southeast-1.amazonaws.com/default-avatar.png",
    },
  })

  const billy_selvi = await db.friendship.create({
    data: {
      userId: billy.userId,
      friendId: selvi.userId,
      status: 'ACCEPTED',
    },
  })

  const aufii_billy = await db.friendship.create({
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

  const billy_selvi_chatRoom = await db.chatRoom.create({
    data: {
      friendshipId: billy_selvi.friendshipId,
    }
  })

  const _aufii_billy_chatRoom = await db.chatRoom.create({
    data: {
      friendshipId: aufii_billy.friendshipId,
    }
  })

  await db.message.create({
    data: {
      chatRoomId: billy_selvi_chatRoom.chatRoomId,
      senderId: billy.userId,
      content: 'Hello Selvi!',
      type: MessageType.TEXT,
    }
  })

  await db.message.create({
    data: {
      chatRoomId: billy_selvi_chatRoom.chatRoomId,
      senderId: selvi.userId,
      content: 'Hello Billy!',
      type: MessageType.TEXT,
    }
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
