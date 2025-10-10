import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { AddLivrosDto } from './dto/add-livros.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ListaEsperaService } from '../lista-espera/lista-espera.service';

@Injectable()
export class ReservasService {
  private readonly logger = new Logger(ReservasService.name);

  constructor(private prisma: PrismaService, private listaEsperaService: ListaEsperaService) {}

  async create(dto: CreateReservaDto) {
    // valida usuário
    const usuario = await this.prisma.usuario.findUnique({ where: { idUsuario: dto.idUsuario }});
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    // valida livros e disponibilidade
    const livros = await this.prisma.livro.findMany({
      where: { idLivro: { in: dto.idLivros } },
    });

    if (livros.length !== dto.idLivros.length) {
      throw new NotFoundException('Um ou mais livros não encontrados');
    }

    // cria reserva
    const reserva = await this.prisma.reserva.create({
      data: {
        idUsuario: dto.idUsuario,
      },
    });

    // para cada livro: se disponível -> criar assoc e marcar reservado
    for (const livro of livros) {
      if (livro.status === 'DISPO') {
        await this.prisma.reservaLivro.create({
          data: { idReserva: reserva.idReserva, idLivro: livro.idLivro },
        });
        await this.prisma.livro.update({
          where: { idLivro: livro.idLivro },
          data: { status: 'RESERVADO' },
        });
      } else {
        // se não disponível, adiciona o usuário à lista de espera
        await this.listaEsperaService.create({ idUsuario: dto.idUsuario, idLivro: livro.idLivro });
      }
    }

    return this.findOne(reserva.idReserva);
  }

  findAll() {
    return this.prisma.reserva.findMany({
      include: { usuario: true, livros: { include: { livro: true } } },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { idReserva: id },
      include: { usuario: true, livros: { include: { livro: true } } },
    });
    if (!reserva) throw new NotFoundException('Reserva não encontrada');
    return reserva;
  }

  async addLivros(dto: AddLivrosDto) {
    const reserva = await this.prisma.reserva.findUnique({ where: { idReserva: dto.idReserva }});
    if (!reserva) throw new NotFoundException('Reserva não encontrada');

    const livros = await this.prisma.livro.findMany({
      where: { idLivro: { in: dto.idLivros } },
    });

    for (const livro of livros) {
      const exists = await this.prisma.reservaLivro.findUnique({
        where: { idReserva_idLivro: { idReserva: dto.idReserva, idLivro: livro.idLivro } as any },
      }).catch(() => null);

      if (!exists) {
        if (livro.status === 'DISPO') {
          await this.prisma.reservaLivro.create({
            data: { idReserva: dto.idReserva, idLivro: livro.idLivro },
          });
          await this.prisma.livro.update({ where: { idLivro: livro.idLivro }, data: { status: 'RESERVADO' }});
        } else {
          await this.listaEsperaService.create({ idUsuario: reserva.idUsuario, idLivro: livro.idLivro });
        }
      }
    }

    return this.findOne(dto.idReserva);
  }

  async update(id: number, dto: UpdateReservaDto) {
    await this.findOne(id);
    return this.prisma.reserva.update({ where: { idReserva: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    // libera livros relacionados (marca DISPO)
    const rels = await this.prisma.reservaLivro.findMany({ where: { idReserva: id }});
    for (const r of rels) {
      await this.prisma.livro.update({ where: { idLivro: r.idLivro }, data: { status: 'DISPO' }});
    }
    await this.prisma.reservaLivro.deleteMany({ where: { idReserva: id }});
    await this.prisma.reserva.delete({ where: { idReserva: id }});
    return { ok: true };
  }

  // chamada quando o livro é devolvido: liberta, e notifica (pop da fila)
  async processarDevolucao(idLivro: number) {
    // marca livro disponível
    await this.prisma.livro.update({ where: { idLivro }, data: { status: 'DISPO' }});

    // ver fila de espera
    const proximo = await this.listaEsperaService.popProximoAtendido(idLivro);
    if (!proximo) return { message: 'Livro disponibilizado, sem fila' };

    // cria reserva para esse usuário (ou notifica): aqui cria uma reserva com o livro associado e marca livro reservado
    const novaReserva = await this.prisma.reserva.create({
      data: { idUsuario: proximo.idUsuario },
    });

    await this.prisma.reservaLivro.create({
      data: { idReserva: novaReserva.idReserva, idLivro },
    });

    await this.prisma.livro.update({ where: { idLivro }, data: { status: 'RESERVADO' }});

    // atualiza dataNotificacao
    await this.prisma.reserva.update({
      where: { idReserva: novaReserva.idReserva },
      data: { dataNotificacao: new Date() },
    });

    // opcional: retornar info para enviar email/aviso
    return { message: 'Próximo da fila notificado e reserva criada', reserva: novaReserva, usuarioNotificado: proximo.idUsuario };
  }
}
