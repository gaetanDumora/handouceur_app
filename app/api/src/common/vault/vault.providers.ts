import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VaultService } from './vault.service';
import { Config, DatabaseConfig } from 'src/configs/config.interface';

export const credentialsProviders: Provider[] = [
  {
    provide: 'DB_CONNECTION_URL',
    inject: [VaultService, ConfigService],
    useFactory: async (vault: VaultService, config: ConfigService<Config>) => {
      const { host, port, name } = config.get<DatabaseConfig>('database', {
        infer: true,
      });
      const { username, password } = await vault.getDatabaseCredentials();
      const connectionUrl = `postgresql://${username}:${password}@${host}:${port}/${name}?sslmode=require`;
      return connectionUrl;
    },
  },
];
