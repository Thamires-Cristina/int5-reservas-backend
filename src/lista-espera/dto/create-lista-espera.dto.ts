import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { FilaStatus } from '@prisma/client';

export class CreateListaEsperaDto {
  @IsInt()
  idUsuario: number;

  @IsInt()
  idLivro: number;

  @IsInt()
  @IsOptional()
  ordemFila?: number; // opcional, o serviço coloca 0 se não enviado

  @IsEnum(FilaStatus)
  @IsOptional()
  statusFila?: FilaStatus; // opcional, o serviço coloca ATIVO se não enviado
}
