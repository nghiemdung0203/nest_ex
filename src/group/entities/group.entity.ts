/* eslint-disable prettier/prettier */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Permission } from 'src/permision/entities/permission.entity';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Permission, (permission) => permission.groups)
    @JoinTable({
        name: 'group_permissions',
        joinColumn: { name: 'group_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    })
    permissions: Permission[];

    @ManyToMany(() => User, (user) => user.groups)
    users: User[];
}
    