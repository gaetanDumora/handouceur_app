import {
  Controller,
  Get,
  Param,
  Request as Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/guards/roles.decorator';
import { USER_ROLES } from './users.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(USER_ROLES.ADMIN, USER_ROLES.OWNER)
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    return await this.usersService.findAll();
  }

  @Roles(USER_ROLES.ADMIN, USER_ROLES.OWNER)
  @UseGuards(RolesGuard)
  @Get('profile/:id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    if (!req.user?.sub || req.user.sub !== Number(id)) {
      throw new UnauthorizedException();
    }
    return await this.usersService.getProfile(req.user.username);
  }
}
