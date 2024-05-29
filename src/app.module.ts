import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma/prisma.service'
import { PrismaModule } from './prisma/prisma.module'
import { WinstonModule } from 'nest-winston'
import { ValidationModule } from './validation/validation.module';
import { UserModule } from './user/user.module';
import * as winston from 'winston'
import { LogMiddleware } from './log/log.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      level: 'debug',
      transports: [
        new winston.transports.Console(),
      ],
    }),
    PrismaModule,
    ValidationModule.forRoot(true),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .forRoutes({
        path: '/api/*',
        method: RequestMethod.ALL,
      });
  }
}
