import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepo } from 'src/repositories/repositories.users';
import { prismaProviders } from 'src/common/prisma/prisma.providers';

@Module({
  providers: [UsersService, UsersRepo, ...prismaProviders],
  controllers: [UsersController],
})
export class UsersModule {}
