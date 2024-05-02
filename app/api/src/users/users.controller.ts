import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/common/interceptors/interceptor.serialize';
import { Roles } from 'src/auth/guards/roles.decorator';
import { USER_ROLES } from './users.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserDTO } from './users.dto';
import { IsMeGuard } from 'src/auth/guards/isme.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.OWNER)
  @UseInterceptors(new SerializeInterceptor(UserDTO))
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(IsMeGuard)
  @UseInterceptors(new SerializeInterceptor(UserDTO))
  @HttpCode(HttpStatus.OK)
  @Get('profile/:id')
  async findOne(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return await this.usersService.findOne(userId);
  }
}
