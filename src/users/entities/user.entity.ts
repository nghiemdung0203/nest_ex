/* eslint-disable prettier/prettier */
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/group/entities/group.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Expose()
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    @Expose()
    avatarUrl: string;

    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable({
        name: 'user_groups',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'group_id', referencedColumnName: 'id' },
    })
    groups: Group[];

    constructor(user: Partial<User>) {
        //Partial giúp không nhất thiết phải pass toàn bộ thuộc tính
        Object.assign(this, user); //  Truyền các thuộc tính từ user vào biến this.
    }
}
