import { IsInt, IsNotEmpty, ArrayNotEmpty, ArrayUnique, IsArray } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  idUsuario: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  idLivros: number[];
}
