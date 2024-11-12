/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsUrl, Length, Matches, ValidateIf } from 'class-validator';

export class UpdateUserDto {
    @ValidateIf(o => !o.password && !o.avatarUrl)
    @IsOptional()
    @IsString()
    @Length(3, 20, { message: 'Username must be between 3 and 20 characters.' })
    username: string;

    @ValidateIf(o => !o.username && !o.avatarUrl)
    @IsString()
    @IsOptional()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters.' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%@#^&*?])[A-Za-z\d!$%@#^&*?]{6,20}$/, {
        message: 'Password must contain at least one letter, one number, and one special character',
    })
    password: string;

    @ValidateIf(o => !o.username && !o.password)
    @IsUrl()
    @IsOptional()
    avatarUrl: string;
}
