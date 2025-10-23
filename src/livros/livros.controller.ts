import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LivrosService } from './livros.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { livro_status } from '@prisma/client'; // enum correto do Prisma

@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) { }

  @Post()
  create(@Body() dto: CreateLivroDto) {
    return this.livrosService.create(dto);
  }

  @Get()
  findAll() {
    return this.livrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.livrosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLivroDto) {
    return this.livrosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.livrosService.remove(id);
  }

  @Post(':id/marcar/:status')
  marcar(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: 'DISPO' | 'INDISPO' | 'RESERVADO',
  ) {
    return this.livrosService.marcarDisponibilidade(id, status);
  }
}
