/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequirePermissions } from 'src/role/requires-permissions.decorator';
import { RoleGuard } from 'src/role/role.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  @RequirePermissions('CREATE_ACCOUNT')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('auth')
  @RequirePermissions('GET_ACCOUNT')
  async authenticateUser(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto);
    return this.authService.generateToken(user);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequirePermissions('UPDATE_ACCOUNT')
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new UnauthorizedException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.usersService.updateUserInfo(
        req.user.username,
        updateUserDto,
        req.user.userId,
        file,
      );
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequirePermissions('DELETE_ACCOUNT')
  async deleteAccount(@Param('id') deleteId: number) {
    return await this.usersService.deleteAccountService(deleteId);
  }
}
