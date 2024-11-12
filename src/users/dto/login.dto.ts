/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%@#^&*?])[A-Za-z\d!$%@#^&*?]{6,20}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
