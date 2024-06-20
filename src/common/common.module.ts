import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { PrismaService } from './prisma.service'
import { ValidationService } from './validation.service'
import { ErrorFilter } from './error.filter'
import { MulterService } from './multer.service'

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: 'APP_FILTER',
      useClass: ErrorFilter,
    },
    MulterService,
  ],
  exports: [PrismaService, ValidationService, MulterService],
})
export class CommonModule {}
