/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters.' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%@#^&*?])[A-Za-z\d!$%@#^&*?]{6,20}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
