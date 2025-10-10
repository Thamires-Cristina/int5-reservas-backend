import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { LivrosModule } from './livros/livros.module';
import { ReservasModule } from './reservas/reservas.module';
import { ListaEsperaModule } from './lista-espera/lista-espera.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservasScheduler } from './reservas/reservas.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsuariosModule,
    LivrosModule,
    ListaEsperaModule,
    ReservasModule,
  ],
  providers: [PrismaService, ReservasScheduler],
})
export class AppModule {}
