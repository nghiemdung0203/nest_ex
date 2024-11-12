/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { RoleGuard } from './role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [RoleGuard],
  exports: [RoleGuard],
})
export class RoleModule {}
