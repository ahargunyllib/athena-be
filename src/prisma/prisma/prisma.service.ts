import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
    this.logger.info(`Create prisma service`);
  }

  onModuleInit() {
    this.logger.info('Connect Prisma');
    this.$connect();
  }

  onModuleDestroy() {
    this.logger.info('Disconnect Prisma');
    this.$disconnect();
  }
}