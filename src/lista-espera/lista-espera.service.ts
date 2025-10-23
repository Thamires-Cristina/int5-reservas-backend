import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListaEsperaDto } from './dto/create-lista-espera.dto';
import { UpdateListaEsperaDto } from './dto/update-lista-espera.dto';
import { listaespera_statusFila } from '@prisma/client';

@Injectable()
export class ListaEsperaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateListaEsperaDto) {
    return this.prisma.listaespera.create({
      data: {
        idUsuario: dto.idUsuario,
        idLivro: dto.idLivro,
        ordemFila: dto.ordemFila ?? 0,
        statusFila: dto.statusFila
          ? listaespera_statusFila[dto.statusFila as keyof typeof listaespera_statusFila]
          : listaespera_statusFila.Ativo,
      },
    });
  }

  async findAll() {
    return this.prisma.listaespera.findMany({ orderBy: { idLista: 'asc' } });
  }

  async findByLivro(idLivro: number) {
    return this.prisma.listaespera.findMany({
      where: { idLivro },
      orderBy: { ordemFila: 'asc' },
    });
  }

  async update(idLista: number, dto: UpdateListaEsperaDto) {
    const item = await this.prisma.listaespera.findUnique({ where: { idLista } });
    if (!item) throw new NotFoundException('Item da fila não encontrado');

    const statusFila = dto.statusFila
      ? listaespera_statusFila[dto.statusFila as keyof typeof listaespera_statusFila]
      : item.statusFila;

    return this.prisma.listaespera.update({
      where: { idLista },
      data: {
        ordemFila: dto.ordemFila ?? item.ordemFila,
        statusFila,
      },
    });
  }

  async remove(idLista: number) {
    const item = await this.prisma.listaespera.findUnique({ where: { idLista } });
    if (!item) throw new NotFoundException('Item da fila não encontrado');

    await this.prisma.listaespera.delete({ where: { idLista } });
    return { ok: true };
  }

  async popProximoAtendido(idLivro: number) {
    const primeiro = await this.prisma.listaespera.findFirst({
      where: { idLivro, statusFila: listaespera_statusFila.Ativo },
      orderBy: { ordemFila: 'asc' },
    });

    if (!primeiro) throw new NotFoundException('Nenhum usuário ativo na fila');

    await this.prisma.listaespera.update({
      where: { idLista: primeiro.idLista },
      data: { statusFila: listaespera_statusFila.Atendido },
    });

    return primeiro;
  }
}
