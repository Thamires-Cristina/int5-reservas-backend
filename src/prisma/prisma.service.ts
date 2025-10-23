import { INestApplication, Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('SIGINT', async () => {
      await this.$disconnect();
      await app.close();
      process.exit(0);
    });

    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
  }
}
