/* eslint-disable prettier/prettier */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PERMISSIONS_KEY } from './requires-permissions.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject the cache manager
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const username = request.user?.username;

    if (!username) {
      throw new UnauthorizedException('User not authenticated');
    }

    const cachedUser = await this.cacheManager.get<any>(username);

    if (!cachedUser) {
      throw new UnauthorizedException('User session not found. Please log in again.');
    }

    const userPermissions = new Set<string>();
    cachedUser.groups.forEach((group) => {
      group.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    });

    return requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );
  }
}
