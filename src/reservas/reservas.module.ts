import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ListaEsperaModule } from '../lista-espera/lista-espera.module';

@Module({
  imports: [ListaEsperaModule],
  controllers: [ReservasController],
  providers: [ReservasService, PrismaService],
})
export class ReservasModule {}
