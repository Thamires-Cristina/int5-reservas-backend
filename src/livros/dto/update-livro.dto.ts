import { IsOptional, IsInt, IsEnum } from 'class-validator';
import { livro_status } from '@prisma/client';

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
  @IsEnum(livro_status)
  status?: livro_status;
}
