/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionsRepository: Repository<Permission>,
    ) { }

    async createPermission(name: string): Promise<Permission> {
        const permission = this.permissionsRepository.create({ name });
        return await this.permissionsRepository.save(permission);
    }

    async getPermissionsOfUser(userId: number): Promise<any> {
        const permissions = await this.permissionsRepository.find({
            where: {
                groups: {
                    users: {
                        id: userId,
                    },
                },
            },
        });
        return permissions;
    }
}
