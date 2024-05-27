import * as NodeVault from 'node-vault';
import { ConfigService } from '@nestjs/config';
import { Config, VaultConfig } from 'src/configs/config.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DatabaseRoles,
  DatabaseSecret,
  DB_ROLES,
  KvKeys,
  KvSecret,
} from './vault.interface';

@Injectable()
export class VaultService {
  private readonly vaultConfig = this.config.get<VaultConfig>('vault', {
    infer: true,
  });
  private readonly vaultInstance = NodeVault({
    apiVersion: 'v1',
    endpoint: this.vaultConfig.url,
  });

  constructor(private readonly config: ConfigService<Config>) {}

  private async login() {
    console.log('[vault] login');
    await this.vaultInstance.approleLogin({
      role_id: this.vaultConfig.appRoleId,
      secret_id: this.vaultConfig.appSecret,
    });
  }

  private async readSecret<T>(path: string): Promise<T> {
    try {
      // Make sure that 'approle' token exist or is still valid before reading secret in vault
      await this.vaultInstance.tokenLookupSelf();

      const secret = await this.vaultInstance.read(path);
      if (!secret.data) {
        throw new Error(`[vault] failed to read secret at path: ${path}`);
      }
      return secret;
    } catch (error) {
      if (error?.response?.statusCode === HttpStatus.FORBIDDEN) {
        await this.login();
        return this.readSecret(path);
      } else {
        throw error;
      }
    }
  }

  async getDatabaseCredentials(role: DatabaseRoles = DB_ROLES.DEFAULT) {
    const path = `${this.vaultConfig.pathDb}/${role}`;
    const credentials = await this.readSecret<DatabaseSecret>(path);
    console.log('[vault] now using role: ', {
      ...credentials.data,
    });
    return credentials.data;
  }

  async getKvSecret(key?: KvKeys) {
    console.log('[vault] getting kv-v2 secret');
    const secrets = await this.readSecret<KvSecret>(this.vaultConfig.pathKv);

    if (!secrets?.data?.data) {
      throw new Error(`[vault] failed to read kv secrets`);
    }

    const secretValue = secrets.data.data;
    if (key) {
      return secretValue[key];
    }

    return secretValue;
  }
}
