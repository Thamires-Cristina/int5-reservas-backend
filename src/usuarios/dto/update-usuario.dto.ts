import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  nomeUsuario?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6)
  senha: string;
}
