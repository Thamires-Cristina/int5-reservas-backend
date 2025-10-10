import { IsOptional } from 'class-validator';

export class UpdateListaEsperaDto {
  @IsOptional()
  ordemFila?: number;

  @IsOptional()
  statusFila?: 'ATIVO' | 'CANCELADO' | 'ATENDIDO';
}
