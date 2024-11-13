/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = new User({ ...createUserDto, password: hashedPassword });
      await this.entityManager.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findByUsername(loginDto: LoginDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { username: loginDto.username },
        relations: ['groups', 'groups.permissions'],
      });

      if (user && (await bcrypt.compare(loginDto.password, user.password))) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        await this.cacheManager.set(result.username, result);
        const cachedUser = await this.cacheManager.get(result.username);
        return cachedUser;
      } else {
        throw new BadRequestException('Invalid username or password');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUserInfo(
    username: string,
    updateUserDto: UpdateUserDto,
    requestUserId: number,
    file?: Express.Multer.File,
  ) {
    const cachedUser = await this.cacheManager.get<Partial<User>>(username);
    if (!cachedUser) {
      throw new NotFoundException('User session not found. Please login again.');
    }
    if (cachedUser.id !== requestUserId) {
      throw new UnauthorizedException('You are not authorized to update this profile');
    }

    const user = await this.usersRepository.findOneBy({ id: requestUserId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (file) {
      try {
        if (user.avatarUrl) {
          const publicId = this.cloudinaryService.getPublicIdFromUrl(user.avatarUrl);
          await this.cloudinaryService.deleteFile(publicId);
        }
        const avatarUrl = await this.cloudinaryService.uploadFile(file);
        console.log(avatarUrl);
        updateUserDto.avatarUrl = avatarUrl;
      } catch (error) {
        throw new BadRequestException(`Failed to upload image: ${error.message}`);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    try {
      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAccountService(deleteId: number): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: deleteId },
        relations: ['groups'],
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.groups.length > 0) {
        await this.usersRepository.createQueryBuilder()
          .delete()
          .from('user_groups')
          .where('user_id = :userId', { userId: deleteId })
          .execute();
      }
      await this.usersRepository.delete({ id: deleteId });
    } catch (error) {
      if (error.message === 'User not found') {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
