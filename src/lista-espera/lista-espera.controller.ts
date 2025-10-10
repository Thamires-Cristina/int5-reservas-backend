import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListaEsperaService } from './lista-espera.service';
import { CreateListaEsperaDto } from './dto/create-lista-espera.dto';
import { UpdateListaEsperaDto } from './dto/update-lista-espera.dto';

@Controller('lista-espera')
export class ListaEsperaController {
  constructor(private readonly listaEsperaService: ListaEsperaService) {}

  @Post()
  create(@Body() dto: CreateListaEsperaDto) {
    return this.listaEsperaService.create(dto);
  }

  @Get()
  findAll() {
    return this.listaEsperaService.findAll();
  }

  @Get('livro/:idLivro')
  findByLivro(@Param('idLivro') idLivro: string) {
    return this.listaEsperaService.findByLivro(Number(idLivro));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListaEsperaDto) {
    return this.listaEsperaService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listaEsperaService.remove(Number(id));
  }

  @Get('atender/:idLivro')
  popProximoAtendido(@Param('idLivro') idLivro: string) {
    return this.listaEsperaService.popProximoAtendido(Number(idLivro));
  }
}
