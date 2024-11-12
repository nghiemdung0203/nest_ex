/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Permission } from '../permision/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddUserToGroup } from './dto/add-user-to-group.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private readonly groupsRepository: Repository<Group>,
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async addPermissionToGroup(groupId: number, permissionId: number): Promise<Group> {
        const group = await this.groupsRepository.findOne({
            where: { id: groupId },
            relations: ['permissions'],
        });
        const permission = await this.permissionsRepository.findOne({ where: { id: permissionId } });
        if (!group || !permission) {
            throw new Error('Group or Permission not found');
        }

        group.permissions.push(permission);
        return this.groupsRepository.save(group);
    }

    async createGroup(createGroupDto: CreateGroupDto) {
        const { name, permissionIds } = createGroupDto;
        const existingGroup = await this.groupsRepository.findOne({ where: { name } });
        if (existingGroup) {
            throw new BadRequestException('Group with this name already exists');
        }

        let permissions = [];
        if (permissionIds && permissionIds.length > 0) {
            permissions = await this.permissionsRepository.findByIds(permissionIds);
            if (permissions.length !== permissionIds.length) {
                throw new NotFoundException('One or more permissions not found');
            }
        }

        const newGroup = this.groupsRepository.create({
            name,
            permissions,
        });
        console.log(newGroup);
        return this.groupsRepository.save(newGroup);
    }

    async addUserToGroup(dto: AddUserToGroup): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
            relations: ['groups'],
        });

        const group = await this.groupsRepository.findOne({ where: { id: dto.groupId } });

        if (!user || !group) {
            throw new Error('User or Group not found');
        }

        user.groups.push(group);
        return this.userRepository.save(user);
    }

    async inActivateGroup(groupId: number): Promise<void> {
        const group = await this.groupsRepository.findOne({
            where: { id: groupId },
            relations: ['permissions', 'users'],
        });
        if (!group) {
            throw new NotFoundException(`Group with ID ${groupId} not found`);
        }

        await this.groupsRepository.manager.transaction(async transactionalEntityManager => {
            if (group.permissions?.length > 0) {
                group.permissions = [];
                await transactionalEntityManager.save(group);
            }
            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from('user_groups')
                .where('group_id = :groupId', { groupId })
                .execute();

            await transactionalEntityManager
                .createQueryBuilder()
                .delete()
                .from('group_permissions')
                .where('group_id = :groupId', { groupId })
                .execute();
            await transactionalEntityManager.delete(Group, groupId);
        });
    }
}
