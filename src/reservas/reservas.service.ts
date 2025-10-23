import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { AddLivrosDto } from './dto/add-livros.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ListaEsperaService } from '../lista-espera/lista-espera.service';
import { livro_status } from '@prisma/client';

@Injectable()
export class ReservasService {
  private readonly logger = new Logger(ReservasService.name);

  constructor(
    private prisma: PrismaService,
    private listaEsperaService: ListaEsperaService,
  ) {}

  async create(dto: CreateReservaDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { idUsuario: dto.idUsuario } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const livros = await this.prisma.livro.findMany({ where: { idLivro: { in: dto.idLivros } } });
    if (livros.length !== dto.idLivros.length)
      throw new NotFoundException('Um ou mais livros não encontrados');

    const reserva = await this.prisma.reserva.create({ data: { idUsuario: dto.idUsuario } });

    for (const livro of livros) {
      if (livro.status === livro_status.DISPONIVEL) {
        await this.prisma.reservalivro.create({ data: { idReserva: reserva.idReserva, idLivro: livro.idLivro } });
        await this.prisma.livro.update({ where: { idLivro: livro.idLivro }, data: { status: livro_status.RESERVADO } });
      } else {
        await this.listaEsperaService.create({ idUsuario: dto.idUsuario, idLivro: livro.idLivro });
      }
    }

    return this.findOne(reserva.idReserva);
  }

  findAll() {
    return this.prisma.reserva.findMany({
      include: { usuario: true, reservalivro: { include: { livro: true } } },
    });
  }

  async findOne(id: number) {
    const reserva = await this.prisma.reserva.findUnique({
      where: { idReserva: id },
      include: { usuario: true, reservalivro: { include: { livro: true } } },
    });
    if (!reserva) throw new NotFoundException('Reserva não encontrada');
    return reserva;
  }

  async addLivros(dto: AddLivrosDto) {
    const reserva = await this.prisma.reserva.findUnique({ where: { idReserva: dto.idReserva } });
    if (!reserva) throw new NotFoundException('Reserva não encontrada');

    const livros = await this.prisma.livro.findMany({ where: { idLivro: { in: dto.idLivros } } });

    for (const livro of livros) {
      const exists = await this.prisma.reservalivro.findUnique({
        where: { idReserva_idLivro: { idReserva: dto.idReserva, idLivro: livro.idLivro } as any },
      }).catch(() => null);

      if (!exists) {
        if (livro.status === livro_status.DISPONIVEL) {
          await this.prisma.reservalivro.create({ data: { idReserva: dto.idReserva, idLivro: livro.idLivro } });
          await this.prisma.livro.update({ where: { idLivro: livro.idLivro }, data: { status: livro_status.RESERVADO } });
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

    const rels = await this.prisma.reservalivro.findMany({ where: { idReserva: id } });
    for (const r of rels) {
      await this.prisma.livro.update({ where: { idLivro: r.idLivro }, data: { status: livro_status.DISPONIVEL } });
    }

    await this.prisma.reservalivro.deleteMany({ where: { idReserva: id } });
    await this.prisma.reserva.delete({ where: { idReserva: id } });
    return { ok: true };
  }

  async processarDevolucao(idLivro: number) {
    await this.prisma.livro.update({ where: { idLivro }, data: { status: livro_status.DISPONIVEL } });

    const proximo = await this.listaEsperaService.popProximoAtendido(idLivro).catch(() => null);
    if (!proximo) return { message: 'Livro disponibilizado, sem fila' };

    const novaReserva = await this.prisma.reserva.create({ data: { idUsuario: proximo.idUsuario } });
    await this.prisma.reservalivro.create({ data: { idReserva: novaReserva.idReserva, idLivro } });
    await this.prisma.livro.update({ where: { idLivro }, data: { status: livro_status.RESERVADO } });
    await this.prisma.reserva.update({ where: { idReserva: novaReserva.idReserva }, data: { dataNotificacao: new Date() } });

    return { message: 'Próximo da fila notificado e reserva criada', reserva: novaReserva, usuarioNotificado: proximo.idUsuario };
  }

  // 🔹 Novo método para listar todos os livros (para Angular)
  async getAllLivros() {
    return this.prisma.livro.findMany();
  }
}
