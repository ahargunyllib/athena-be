import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response } from 'express'

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.userService.create(createUserDto)
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    })
  }

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.userService.findAll()
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    })
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string, @Res() res: Response) {
    const user = await this.userService.findOne(userId)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    })
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.update(userId, updateUserDto)
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    })
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    await this.userService.remove(userId)
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: [],
    }
  }
}
