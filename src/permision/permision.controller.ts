/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from './permision.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(@Body() body: { name: string }) {
    return this.permissionService.createPermission(body.name);
  }

  @Get('user/:userId')
  async getPermissionsOfUser(@Param('userId') userId: number) {
    return this.permissionService.getPermissionsOfUser(userId);
  }
}
