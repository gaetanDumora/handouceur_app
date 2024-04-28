import { Global, Module } from '@nestjs/common';
import { VaultService } from './vault/vault.service';
import { PrismaService } from './prisma/prisma.service';
import { RepositoriesService } from './repositories/repositories.service';
import { UsersRepo } from './repositories/repositories.users';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    VaultService,
    PrismaService,
    RepositoriesService,
    UsersRepo,
    PrismaClient,
  ],
  exports: [VaultService, UsersRepo],
})
export class CommonModule {}
