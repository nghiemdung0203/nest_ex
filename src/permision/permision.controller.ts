/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { PermissionService } from './permision.service';
import { CreateNewPermissionDto } from './dto/create-new-permission.dto';

@Controller('permission')
@UseInterceptors(ClassSerializerInterceptor) // Enable transformation for all routes
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    async createPermission(@Body() createPermissionDto: CreateNewPermissionDto) {
        return this.permissionService.createPermission(createPermissionDto.name);
    }

    @Get('user/:userId')
    async getPermissionsOfUser(@Param('userId') userId: number) {
        return this.permissionService.getPermissionsOfUser(userId);
    }
}
