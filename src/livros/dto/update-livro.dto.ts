import { IsOptional, IsInt } from 'class-validator';

export class UpdateLivroDto {
  @IsOptional()
  titulo?: string;

  @IsOptional()
  isbn?: string;

  @IsOptional()
  autor?: string;

  @IsOptional()
  editora?: string;

  @IsOptional()
  @IsInt()
  anoPublicacao?: number;

  @IsOptional()
  @IsInt()
  paginas?: number;

  @IsOptional()
  status?: 'DISPO' | 'INDISPO' | 'RESERVADO';
}
