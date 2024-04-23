import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersRepo } from '../repositories/repositories.users';
import { RepositoriesService } from '../repositories/repositories.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, UsersRepo, RepositoriesService],
})
export class AuthModule {}
