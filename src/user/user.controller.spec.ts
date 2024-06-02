import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { TestModule } from '../common/test/test.module'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { TestService } from '../common/test/test.service'
import * as request from 'supertest'
import { CreateUserDtoType } from './dto/create-user.dto'
import { AppModule } from '../app.module'
import exp from 'constants'
import { UpdateUserDtoType } from './dto/update-user.dto'

describe('UserController', () => {
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

  describe('POST /api/user', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should create a user', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })
    })

    it('should return 400 if user already exists', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const response = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
        data: [],
      })
    })

    it('should return 400 if invalid data is provided', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        data: expect.any(Array),
      })
    })
  })

  describe('GET /api/user', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should return all users', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const response = await request(app.getHttpServer()).get('/api/user')

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: expect.arrayContaining([
          {
            userId: user.body.data.userId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            fullName: createUserDto.fullName,
            email: createUserDto.email,
          },
        ]),
      })
    })
  })

  describe('GET /api/user/:id', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should return a user', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const response = await request(app.getHttpServer()).get(
        `/api/user/${user.body.data.userId}`,
      )

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: {
          userId: user.body.data.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })
    })

    it('should return 404 if user does not exist', async () => {
      const response = await request(app.getHttpServer()).get('/api/user/1')

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        data: [],
      })
    })
  })

  describe('PATCH /api/user/:id', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should update a user', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const updateUserDto: UpdateUserDtoType = {
        fullName: 'test',
        email: 'test2@test.com',
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/user/${user.body.data.userId}`)
        .send(updateUserDto)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: {
          userId: user.body.data.userId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: updateUserDto.fullName,
          email: updateUserDto.email,
        },
      })
    })

    it('should return 404 if user does not exist', async () => {
      const updateUserDto: UpdateUserDtoType = {
        fullName: 'test',
        email: 'test2@test.com',
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/user/1`)
        .send(updateUserDto)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        data: [],
      })
    })

    it('should return 400 if invalid data is provided', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const updateUserDto: UpdateUserDtoType = {
        fullName: 'test',
        email: 'test',
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/user/${user.body.data.userId}`)
        .send(updateUserDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        data: expect.any(Array),
      })
    })
  })

  describe('DELETE /api/user/:id', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should delete a user', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/user')
        .send(createUserDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          fullName: createUserDto.fullName,
          email: createUserDto.email,
        },
      })

      const response = await request(app.getHttpServer()).delete(
        `/api/user/${user.body.data.userId}`,
      )

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data: [],
      })
    })

    it('should return 404 if user does not exist', async () => {
      const response = await request(app.getHttpServer()).delete('/api/user/1')

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        data: [],
      })
    })
  })
})
