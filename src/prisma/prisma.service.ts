import { INestApplication, Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit() {
    await this.$connect();
  }

  // Conecta o Prisma com a aplicação NestJS
  async enableShutdownHooks(app: INestApplication) {
    // Intercepta o evento SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
      await this.$disconnect();
      await app.close();
      process.exit(0);
    });

    // Intercepta saída normal do Node.js
    process.on('beforeExit', async () => {
      await this.$disconnect();
      await app.close();
    });
  }

  async onApplicationShutdown(signal?: string) {
    await this.$disconnect();
  }
}
