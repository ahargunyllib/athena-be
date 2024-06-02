import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { TestService } from '../common/test/test.service'
import { AppModule } from '../app.module'
import { TestModule } from '../common/test/test.module'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as request from 'supertest'
import { LoginDtoType } from './dto/login.dto'
import exp from 'constants'
import { RegisterDtoType } from './dto/register.dto'

describe('AuthController', () => {
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

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should return a user', async () => {
      const registerDto: RegisterDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(response.status).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          userId: expect.any(String),
          fullName: registerDto.fullName,
          email: registerDto.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      })
    })

    it('should return a 400 error if user already exists', async () => {
      const registerDto: RegisterDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          userId: expect.any(String),
          fullName: registerDto.fullName,
          email: registerDto.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      })

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists',
        data: [],
      })
    })

    it('should return a 400 error if email is invalid', async () => {
      const registerDto: RegisterDtoType = {
        fullName: 'test',
        email: 'test',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        data: expect.any(Array),
      })
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await testService.deleteAll()
    })

    it('should return a token and user', async () => {
      const registerDto: RegisterDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          userId: expect.any(String),
          fullName: registerDto.fullName,
          email: registerDto.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      })

      const loginDto: LoginDtoType = {
        email: 'test@test.com',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)

      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User logged in successfully',
        data: {
          token: expect.any(String),
          user: {
            userId: expect.any(String),
            fullName: registerDto.fullName,
            email: registerDto.email,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        },
      })
    })

    it('should return a 404 error if user not found', async () => {
      const loginDto: LoginDtoType = {
        email: 'test@test.com',
        password: '123456',
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)

      expect(response.status).toBe(HttpStatus.NOT_FOUND)
      expect(response.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
        data: [],
      })
    })

    it('should return a 400 error if password is invalid', async () => {
      const registerDto: RegisterDtoType = {
        fullName: 'test',
        email: 'test@test.com',
        password: '123456',
      }

      const user = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)

      expect(user.status).toBe(HttpStatus.CREATED)
      expect(user.body).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          userId: expect.any(String),
          fullName: registerDto.fullName,
          email: registerDto.email,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      })

      const loginDto: LoginDtoType = {
        email: 'test@test.com',
        password: '1234567',
      }

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)

      expect(response.status).toBe(HttpStatus.BAD_REQUEST)
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid password',
        data: [],
      })
    })
  })
})
