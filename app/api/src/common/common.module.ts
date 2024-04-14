import { Global, Module } from '@nestjs/common';
import { VaultService } from './vault/vault.service';
import { PrismaService } from './prisma/prisma.service';
import { prismaProviders } from './prisma/prisma.providers';

@Global()
@Module({
  providers: [VaultService, PrismaService, ...prismaProviders],
  exports: [PrismaService],
})
export class CommonModule {}
