import { IsOptional, IsEnum } from 'class-validator';
import { reserva_statusReserva } from '@prisma/client';

export class UpdateReservaDto {
  @IsOptional()
  @IsEnum(reserva_statusReserva)
  statusReserva?: reserva_statusReserva;

  @IsOptional()
  dataRetirada?: Date;

  @IsOptional()
  dataDevolucao?: Date;
}
