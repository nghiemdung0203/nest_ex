/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { GroupsService } from "./group.service";
import { GroupController } from "./group.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./entities/group.entity";
import { Permission } from "src/permision/entities/permission.entity";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Group, Permission]),
        UsersModule
    ],
    providers: [GroupsService],
    controllers: [GroupController]
})

export class GroupModule { }