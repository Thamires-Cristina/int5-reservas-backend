import { Module } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { LivrosController } from './livros.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LivrosController],
  providers: [LivrosService, PrismaService],
  exports: [LivrosService],
})
export class LivrosModule {}
