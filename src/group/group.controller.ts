/* eslint-disable prettier/prettier */

import { Body, ClassSerializerInterceptor, Controller, Delete, Param, Post, UseInterceptors } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUserToGroup } from './dto/add-user-to-group.dto';
import { GroupsService } from './group.service';
import { GroupResponseDto } from './dto/group-response-dto';
import { User } from 'src/users/entities/user.entity';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('group')
export class GroupController {
    constructor(private readonly groupsService: GroupsService) { }

    @Post('/permission/:groupId/:permissionId')
    async addPermissionToGroup(
        @Param('groupId') groupId: number,
        @Param('permissionId') permissionId: number,
    ): Promise<GroupResponseDto> {
        const updatedGroup = await this.groupsService.addPermissionToGroup(groupId, permissionId);
        return new GroupResponseDto(updatedGroup);
    }

    @Post()
    async createGroup(@Body() createGroupDto: CreateGroupDto): Promise<GroupResponseDto> {
        try {
            const newGroup = await this.groupsService.createGroup(createGroupDto);
            return new GroupResponseDto(newGroup);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('user')
    async addUserToGroup(@Body() addUserToGroup: AddUserToGroup): Promise<User> {
        const userToGroup = await this.groupsService.addUserToGroup(addUserToGroup);
        return userToGroup;
    }

    @Delete('/:groupId')
    async inActivateGroup(@Param('groupId') groupId: number): Promise<void> {
        await this.groupsService.inActivateGroup(groupId);
    }
}
