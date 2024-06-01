import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { TestModule } from '../common/test/test.module'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { TestService } from '../common/test/test.service'
import * as request from 'supertest'
import { CreateUserDtoType } from './dto/create-user.dto'
import { AppModule } from '../app.module'

describe('UserController', () => {
  let app: INestApplication
  let _logger: Logger
  let testService: TestService

  beforeEach(async () => {
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
          ...createUserDto,
        },
      })
    })

    it('should return 400 if user already exists', async () => {
      const createUserDto: CreateUserDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      await request(app.getHttpServer()).post('/api/user').send(createUserDto)

      const response = await request(app.getHttpServer()).post('/api/user').send(createUserDto)

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
})
