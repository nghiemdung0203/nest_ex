/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  SerializeOptions,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequirePermissions } from 'src/role/requires-permissions.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  @SerializeOptions({ strategy: 'excludeAll' })
  @RequirePermissions('CREATE_ACCOUNT')
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('auth')
  @RequirePermissions('GET_ACCOUNT')
  async authenticateUser(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto);
    return this.authService.generateToken(user);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequirePermissions('UPDATE_ACCOUNT')
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024,
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
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const updatedUser = await this.usersService.updateUserInfo(
        req.user.username,
        updateUserDto,
        req.user.userId,
        file,
      );
      return new UpdateUserResponseDto(updatedUser);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequirePermissions('DELETE_ACCOUNT')
  async deleteAccount(@Param('id', new ValidationPipe({ transform: true, whitelist: true })) deleteId: number) {
    return await this.usersService.deleteAccountService(deleteId);
  }
}
