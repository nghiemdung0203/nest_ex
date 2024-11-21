/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PermisionModule } from './permision/permision.module';
import * as redisStore from 'cache-manager-redis-store';
import { GroupModule } from './group/group.module';
import { ExportModule } from './export/export.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CacheModule.register({
      store: redisStore,
      ttl: 3600,
      max: 20,
      isGlobal: true,
    }),
    PermisionModule,
    GroupModule,
    ExportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
