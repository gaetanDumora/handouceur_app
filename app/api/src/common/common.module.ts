import { Global, Module } from '@nestjs/common';
import { VaultService } from './vault/vault.service';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [VaultService, PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
