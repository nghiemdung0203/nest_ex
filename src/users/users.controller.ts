/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
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
import { UserExportService } from 'src/export/export-user.service';
import { Response } from 'express';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly exportService: UserExportService
  ) { }

  @Post()
  @SerializeOptions({ strategy: 'excludeAll' })
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
  @Patch('update_profile')
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

  @Get('/allUsers')
  async getAllUser(@Res() res: Response): Promise<any> {
    try {
      const users = await this.usersService.getAllUser();
      const excelBuffer = await this.exportService.exportUserData(users);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=users.xlsx'
      );
      res.send(excelBuffer);
    } catch (error) {
      return error.message
    }
  }
}
