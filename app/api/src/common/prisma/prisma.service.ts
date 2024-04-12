import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VaultService } from '../vault/vault.service';
import { ConfigService } from '@nestjs/config';
import { Config, DatabaseConfig } from 'src/configs/config.interface';

@Injectable()
export class PrismaService {
  private prismaInstance: PrismaClient;
  constructor(
    private readonly vaultService: VaultService,
    private readonly config: ConfigService<Config>,
  ) {}

  async getPrismaInstance(newInstance = false) {
    if (this.prismaInstance && !newInstance) {
      console.log('[prisma] getting existing PrismaInstance');
      return this.prismaInstance;
    }

    console.log('[prisma] instantiate new PrismaInstance');
    const datasourceUrl = await this.getDataSourceUrl();
    this.prismaInstance = new PrismaClient({ datasourceUrl });

    return this.prismaInstance;
  }

  private async getDataSourceUrl() {
    const { host, port, name } = this.config.get<DatabaseConfig>('database', {
      infer: true,
    });

    const { username, password } =
      await this.vaultService.getDatabaseCredentials();
    return `postgresql://${username}:${password}@${host}:${port}/${name}?sslmode=require`;
  }
}
