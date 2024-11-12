/* eslint-disable prettier/prettier */

import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  permissionIds: number[];
}
