import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepo } from '../repositories/repositories.users';
import { RepositoriesService } from '../repositories/repositories.service';

@Module({
  providers: [UsersService, UsersRepo, RepositoriesService],
  controllers: [UsersController],
})
export class UsersModule {}
