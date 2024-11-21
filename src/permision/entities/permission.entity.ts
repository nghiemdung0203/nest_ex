/* eslint-disable prettier/prettier */

import { Exclude, Expose, Transform } from 'class-transformer';
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
    @Exclude()
    groups: Group[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    @Transform(({ value }) => value.toISOString())
    createdAt: Date;

    @Column({ default: true})
    isActive: boolean;

    @Expose()
    get displayName() {
        return `Permission: ${this.name}`;
    }

    constructor(partial: Partial<Permission>) {
        Object.assign(this, partial);
    }
}
