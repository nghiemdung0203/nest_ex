/* eslint-disable prettier/prettier */

import { Exclude, Expose } from "class-transformer";
export class UpdateUserResponseDto {

    @Expose()
    id: number;

    @Expose()
    username: string;

    @Exclude()
    password: string;

    @Expose()
    avatarUrl: string;

    constructor(partial: Partial<UpdateUserResponseDto>) {
        Object.assign(this, partial);
    }
}