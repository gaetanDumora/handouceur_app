import {
  Controller,
  Get,
  Param,
  Request as Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/common/interceptors/interceptor.serialize';
import { Roles } from 'src/auth/guards/roles.decorator';
import { USER_ROLES } from './users.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';
import { UserDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(USER_ROLES.ADMIN, USER_ROLES.OWNER)
  @UseInterceptors(new SerializeInterceptor(UserDTO))
  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Get('profile/:id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    if (!req.user?.sub || req.user.sub !== Number(id)) {
      throw new UnauthorizedException();
    }
    return await this.usersService.getProfile(req.user.username);
  }
}
