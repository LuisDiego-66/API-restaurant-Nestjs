import { IsString, Length } from 'class-validator';

export class LoginPinUserDto {
  @IsString()
  @Length(4, 4)
  pin: string;
}
