import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { listaespera_statusFila } from '@prisma/client';

export class CreateListaEsperaDto {
  @IsInt()
  idUsuario: number;

  @IsInt()
  idLivro: number;

  @IsInt()
  @IsOptional()
  ordemFila?: number;

  @IsEnum(listaespera_statusFila)
  @IsOptional()
  statusFila?: listaespera_statusFila;
}
