import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUsuarioDto) {
    return this.prisma.usuario.create({ data });
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { idUsuario: id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, data: UpdateUsuarioDto) {
    await this.findOne(id);
    return this.prisma.usuario.update({ where: { idUsuario: id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({ where: { idUsuario: id } });
  }
}
