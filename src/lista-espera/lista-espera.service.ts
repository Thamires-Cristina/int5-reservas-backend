import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListaEsperaDto } from './dto/create-lista-espera.dto';
import { UpdateListaEsperaDto } from './dto/update-lista-espera.dto';
import { FilaStatus } from '@prisma/client';

@Injectable()
export class ListaEsperaService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um novo item na lista de espera
  async create(dto: CreateListaEsperaDto) {
    return this.prisma.listaEspera.create({
      data: {
        idUsuario: dto.idUsuario,
        idLivro: dto.idLivro,
        ordemFila: dto.ordemFila ?? 0, // valor padrão se não fornecido
        statusFila: dto.statusFila ?? FilaStatus.ATIVO, // enum correto
        // dataEntradaFila: Prisma usa default now()
      },
    });
  }

  // Retorna todos os registros da lista de espera
  async findAll() {
    return this.prisma.listaEspera.findMany({
      orderBy: { idLista: 'asc' },
    });
  }

  // Busca por ID do livro, ordenando pela fila
  async findByLivro(idLivro: number) {
    return this.prisma.listaEspera.findMany({
      where: { idLivro },
      orderBy: { ordemFila: 'asc' },
    });
  }

  // Atualiza um registro existente
  async update(idLista: number, dto: UpdateListaEsperaDto) {
    const item = await this.prisma.listaEspera.findUnique({
      where: { idLista },
    });

    if (!item) {
      throw new NotFoundException('Item da fila não encontrado');
    }

    return this.prisma.listaEspera.update({
      where: { idLista },
      data: {
        ...dto,
        statusFila: dto.statusFila ?? item.statusFila, // mantém enum correto
        ordemFila: dto.ordemFila ?? item.ordemFila,   // mantém valor existente
      },
    });
  }

  // Remove um item da lista de espera
  async remove(idLista: number) {
    const item = await this.prisma.listaEspera.findUnique({
      where: { idLista },
    });

    if (!item) {
      throw new NotFoundException('Item da fila não encontrado');
    }

    await this.prisma.listaEspera.delete({
      where: { idLista },
    });

    return { ok: true };
  }

  // Retorna e marca o primeiro ativo da fila como atendido
  async popProximoAtendido(idLivro: number) {
    const primeiro = await this.prisma.listaEspera.findFirst({
      where: { idLivro, statusFila: FilaStatus.ATIVO },
      orderBy: { ordemFila: 'asc' },
    });

    if (!primeiro) {
      throw new NotFoundException('Nenhum usuário ativo na fila');
    }

    await this.prisma.listaEspera.update({
      where: { idLista: primeiro.idLista },
      data: { statusFila: FilaStatus.ATENDIDO },
    });

    return primeiro;
  }
}
