import { IsOptional } from 'class-validator';

export class UpdateReservaDto {
  @IsOptional()
  statusReserva?: 'ATIVA' | 'CANCELADA' | 'EXPIRADA';

  @IsOptional()
  dataRetirada?: Date;

  @IsOptional()
  dataDevolucao?: Date;
}
