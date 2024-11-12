/* eslint-disable prettier/prettier */

import { IsInt, IsNotEmpty } from 'class-validator';

export class AddUserToGroup {
    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    groupId: number;
}
