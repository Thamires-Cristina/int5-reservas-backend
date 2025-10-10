import { IsInt, ArrayNotEmpty, ArrayUnique, IsArray } from 'class-validator';

export class AddLivrosDto {
  @IsInt()
  idReserva: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  idLivros: number[];
}
