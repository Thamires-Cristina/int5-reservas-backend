import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservasScheduler {
  private readonly logger = new Logger(ReservasScheduler.name);

  constructor(private prisma: PrismaService) {}

  // executa a cada 1 hora — expira reservas que ultrapassaram prazoEmprestimo (se definido)
  @Cron(CronExpression.EVERY_HOUR)
  async verificarExpiradas() {
    this.logger.log('Verificando reservas expiradas...');
    const now = new Date();

    const expiradas = await this.prisma.reserva.findMany({
      where: {
        prazoEmprestimo: { lt: now },
        statusReserva: 'ATIVA',
      },
    });

    for (const r of expiradas) {
      await this.prisma.reserva.update({ where: { idReserva: r.idReserva }, data: { statusReserva: 'EXPIRADA' }});
      // libera livros da reserva
      const rels = await this.prisma.reservaLivro.findMany({ where: { idReserva: r.idReserva }});
      for (const rel of rels) {
        await this.prisma.livro.update({ where: { idLivro: rel.idLivro }, data: { status: 'DISPO' }});
      }
    }

    this.logger.log(`Reservas expiradas processadas: ${expiradas.length}`);
  }
}
