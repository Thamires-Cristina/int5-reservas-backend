import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { reserva_statusReserva } from '@prisma/client';
import { livro_status } from '@prisma/client';

@Injectable()
export class ReservasScheduler {
  private readonly logger = new Logger(ReservasScheduler.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async verificarExpiradas() {
    this.logger.log('Verificando reservas expiradas...');
    const now = new Date();

    const expiradas = await this.prisma.reserva.findMany({
      where: {
        prazoEmprestimo: { lt: now },
        statusReserva: reserva_statusReserva.Ativa,
      },
    });

    for (const r of expiradas) {
      await this.prisma.reserva.update({
        where: { idReserva: r.idReserva },
        data: { statusReserva: reserva_statusReserva.Expirada },
      });

      const rels = await this.prisma.reservalivro.findMany({ where: { idReserva: r.idReserva } });
      for (const rel of rels) {
        await this.prisma.livro.update({ where: { idLivro: rel.idLivro }, data: { status: livro_status.DISPONIVEL } });
      }
    }

    this.logger.log(`Reservas expiradas processadas: ${expiradas.length}`);
  }
}
