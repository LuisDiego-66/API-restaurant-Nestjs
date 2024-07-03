import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  length,
} from 'class-validator';

import { Rol } from '../../auth/entities/rol.entity';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  @Length(4, 4) //! minimo, maximo
  pin: string;

  @IsString()
  cellPhone: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional() //! la imagen se pide obligatoriamente desde el controller
  urlImage?: string;

  //@IsArray()
  @IsUUID()
  //@IsOptional() //! quitar
  rol: Rol; //! no se puede borrar
}
