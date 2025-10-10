import { Module } from '@nestjs/common';
import { ListaEsperaService } from './lista-espera.service';
import { ListaEsperaController } from './lista-espera.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ListaEsperaController],
  providers: [ListaEsperaService, PrismaService],
  exports: [ListaEsperaService], // ← exporta para outros módulos
})
export class ListaEsperaModule {}
