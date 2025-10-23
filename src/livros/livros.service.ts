import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { livro_status } from '@prisma/client';

@Injectable()
export class LivrosService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateLivroDto) {
    return this.prisma.livro.create({ data });
  }

  findAll() {
    return this.prisma.livro.findMany();
  }

  async findOne(id: number) {
    const livro = await this.prisma.livro.findUnique({ where: { idLivro: id } });
    if (!livro) throw new NotFoundException('Livro não encontrado');
    return livro;
  }

  async update(id: number, data: UpdateLivroDto) {
    await this.findOne(id);
    return this.prisma.livro.update({ where: { idLivro: id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.livro.delete({ where: { idLivro: id } });
  }

  async marcarDisponibilidade(id: number, status: 'DISPO' | 'INDISPO' | 'RESERVADO') {
  await this.findOne(id);

  // converte status curto para enum do Prisma
  let prismaStatus: livro_status;
  switch (status) {
    case 'DISPO':
      prismaStatus = livro_status.DISPONIVEL;
      break;
    case 'INDISPO':
      prismaStatus = livro_status.INDISPONIVEL;
      break;
    case 'RESERVADO':
      prismaStatus = livro_status.RESERVADO;
      break;
  }

  return this.prisma.livro.update({
    where: { idLivro: id },
    data: { status: prismaStatus },
  });
}

}
