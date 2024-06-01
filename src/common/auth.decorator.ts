import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common'

export const Auth = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (request) {
      return user
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
  },
)
