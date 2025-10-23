import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { listaespera_statusFila } from '@prisma/client';

export class UpdateListaEsperaDto {
  @IsOptional()
  @IsInt()
  ordemFila?: number;

  @IsOptional()
  @IsEnum(listaespera_statusFila)
  statusFila?: listaespera_statusFila;
}
