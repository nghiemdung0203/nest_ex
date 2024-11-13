/* eslint-disable prettier/prettier */

import { Exclude, Expose, Type } from "class-transformer";
import { Group } from "../entities/group.entity";
export class GroupResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Type(() => PermissionResponseDto)
    permissions: PermissionResponseDto[];

    @Expose()
    @Type(() => UserResponseDto)
    users: UserResponseDto[];

    constructor(partial: Partial<GroupResponseDto>) {
        Object.assign(this, partial);
    }
}

class PermissionResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Exclude()
    groups: Group[];

    constructor(partial: Partial<PermissionResponseDto>) {
        Object.assign(this, partial);
    }
}



class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Exclude()
    password: string;

    @Exclude()
    groups: Group[];

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}