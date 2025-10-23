import { IsOptional, IsInt, IsNotEmpty, IsEnum } from 'class-validator';
import { livro_status } from '@prisma/client';

export class CreateLivroDto {
  @IsNotEmpty()
  titulo: string;

  @IsNotEmpty()
  isbn: string;

  @IsNotEmpty()
  autor: string;

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
