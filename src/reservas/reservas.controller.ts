import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, NotFoundException } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { AddLivrosDto } from './dto/add-livros.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  // 🔹 Listar todos os livros
  @Get('livros')
  getAllLivros() {
    return this.service.getAllLivros();
  }

  // 🔹 Criar nova reserva
  @Post()
  create(@Body() dto: CreateReservaDto) {
    return this.service.create(dto);
  }

  // 🔹 Listar todas as reservas
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔹 Buscar reserva específica
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // 🔹 Adicionar livros a uma reserva existente
  @Post('add-livros')
  addLivros(@Body() dto: AddLivrosDto) {
    return this.service.addLivros(dto);
  }

  // 🔹 Atualizar reserva
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReservaDto) {
    return this.service.update(id, dto);
  }

  // 🔹 Remover reserva
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // 🔹 Processar devolução de livro
  @Post('devolucao/:idLivro')
  devolucao(@Param('idLivro', ParseIntPipe) idLivro: number) {
    return this.service.processarDevolucao(idLivro);
  }
}
