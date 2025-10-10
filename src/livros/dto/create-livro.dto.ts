import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateLivroDto {
  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  isbn: string;

  @IsNotEmpty()
  autor: string;

  @IsOptional()
  editora: string;

  @IsOptional()
  @IsInt()
  anoPublicacao?: number;

  @IsOptional()
  @IsInt()
  paginas?: number;

  @IsOptional()
  status?: 'DISPO' | 'INDISPO' | 'RESERVADO';
}
