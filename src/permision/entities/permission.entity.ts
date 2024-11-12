/* eslint-disable prettier/prettier */

import { Group } from 'src/group/entities/group.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Group, (group) => group.permissions)
    groups: Group[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    constructor(partial: Partial<Permission>) {
        Object.assign(this, partial);
    }
}
