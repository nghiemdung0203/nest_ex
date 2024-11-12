/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUserToGroup } from './dto/add-user-to-group.dto';
import { GroupsService } from './group.service';

@Controller('group')
export class GroupController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post('/permission/:groupId/:permissionId')
    async addPermissionToGroup(
        @Param('groupId') groupId: number,
        @Param('permissionId') permissionId: number,
    ): Promise<void> {
        await this.groupsService.addPermissionToGroup(groupId, permissionId);
    }

    @Post()
    async createGroup(@Body() createGroupDto: CreateGroupDto) {
        try {
            return this.groupsService.createGroup(createGroupDto);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('user')
    async addUserToGroup(@Body() addUserToGroup: AddUserToGroup): Promise<void> {
        await this.groupsService.addUserToGroup(addUserToGroup);
    }

    @Delete('/:groupId')
    async inActivateGroup(@Param('groupId') groupId: number): Promise<void> {
        await this.groupsService.inActivateGroup(groupId);
    }
}
