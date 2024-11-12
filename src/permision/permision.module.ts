/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './permision.service';
import { PermissionController } from './permision.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Permission]),
    ],
    providers: [PermissionService],
    controllers: [PermissionController]
})
export class PermisionModule { }
