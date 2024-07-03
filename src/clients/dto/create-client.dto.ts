import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  document: string;

  @IsString()
  fullName: string;
}
