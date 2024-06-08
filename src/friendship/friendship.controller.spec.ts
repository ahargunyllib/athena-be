import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { AppModule } from '../app.module'
import { TestModule } from '../common/test/test.module'
import { TestService } from '../common/test/test.service'
import * as request from 'supertest'

describe('FriendshipController', () => {
  let app: INestApplication
  let _logger: Logger
  let testService: TestService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()

    _logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  })

  describe('GET /api/friendship/list', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
      await testService.createFriendship()
    })

    it('should return a list of friends', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const response = await request(app.getHttpServer())
        .get('/api/friendship/list')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Friend list retrieved successfully',
        data: [
          {
            userId: expect.any(String),
            fullName: 'Aufii',
            username: 'aufii',
            status: 'ACCEPTED',
          },
          {
            userId: expect.any(String),
            fullName: 'Bagas',
            username: 'bagas',
            status: 'PENDING',
          },
          {
            userId: expect.any(String),
            fullName: 'Selvi',
            username: 'selvi',
            status: 'ACCEPTED',
          },
        ],
      })
    })
  })
  describe('POST /api/friendship/add/:friendId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
      await testService.createFriendship()
    })

    it('should add a friend request', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const danish = await testService.getUser('danish')

      const response = await request(app.getHttpServer())
        .post(`/api/friendship/add/${danish.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.CREATED)

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Friend added successfully',
        data: {
          user: {
            userId: expect.any(String),
            fullName: 'Billy',
            username: 'billy',
          },
          friend: {
            userId: expect.any(String),
            fullName: 'Danish',
            username: 'danish',
          },
          status: 'PENDING',
        },
      })
    })

    it('should return bad request if already friend', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const selvi = await testService.getUser('selvi')

      const response = await request(app.getHttpServer())
        .post(`/api/friendship/add/${selvi.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.BAD_REQUEST)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already friend',
        data: [],
      })
    })

    it('should return bad request if request already sent', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const alfredo = await testService.getUser('alfredo')

      const response = await request(app.getHttpServer())
        .post(`/api/friendship/add/${alfredo.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.BAD_REQUEST)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Friend request already sent',
        data: [],
      })
    })

    it('should accept friend request if already sent by friend', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const bagas = await testService.getUser('bagas')

      const response = await request(app.getHttpServer())
        .post(`/api/friendship/add/${bagas.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.CREATED)

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Friend added successfully',
        data: {
          user: {
            userId: expect.any(String),
            fullName: 'Bagas',
            username: 'bagas',
          },
          friend: {
            userId: expect.any(String),
            fullName: 'Billy',
            username: 'billy',
          },
          status: 'ACCEPTED',
        },
      })
    })
  })

  describe('DELETE /api/friendship/remove/:friendId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
      await testService.createFriendship()
    })

    it('should remove a friend', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const selvi = await testService.getUser('selvi')
      const aufii = await testService.getUser('aufii')

      await request(app.getHttpServer())
        .delete(`/api/friendship/remove/${selvi.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      await request(app.getHttpServer())
        .delete(`/api/friendship/remove/${aufii.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)
    })
  })

  describe('POST /api/friendship/accept/:friendId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
      await testService.createFriendship()
    })

    it('should accept a friend request', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const bagas = await testService.getUser('bagas')

      const response = await request(app.getHttpServer())
        .post(`/api/friendship/accept/${bagas.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Friend request accepted successfully',
        data: [],
      })
    })
  })

  describe('DELETE /api/friendship/reject/:friendId', () => {
    beforeEach(async () => {
      await testService.deleteAll()
      await testService.createUser()
      await testService.createFriendship()
    })

    it('should reject a friend request', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const bagas = await testService.getUser('bagas')

      const response = await request(app.getHttpServer())
        .delete(`/api/friendship/reject/${bagas.userId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Friend request rejected successfully',
        data: [],
      })
    })
  })

  describe('GET /api/friendship/search', () => {
    it('should search for a friend using username', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const response = await request(app.getHttpServer())
        .get('/api/friendship/search?username=danish')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User found successfully',
        data: [
          {
            userId: expect.any(String),
            fullName: 'Danish',
            username: 'danish',
          },
        ],
      })
    })

    it('should return empty array if user not found', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      const response = await request(app.getHttpServer())
        .get('/api/friendship/search?username=notfound')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User found successfully',
        data: [],
      })
    })

    it('should return empty array if user is already friend', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'billy@gmail.com',
          password: '123456',
        })
        .expect(HttpStatus.OK)

      await request(app.getHttpServer())
        .get('/api/friendship/search?username=selvi')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)
      await request(app.getHttpServer())
        .get('/api/friendship/search?username=aufii')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`)
        .expect(HttpStatus.OK)
    })
  })
})
