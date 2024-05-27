import { Config } from './config.interface';
// We can assert as defined because they are validated when app start

const config: Config = {
  nest: {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT!, 10),
  },
  database: {
    url: process.env.DATABASE_URL!,
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABASE_PORT!, 10),
    name: process.env.DATABASE_NAME!,
  },
  vault: {
    certsPath: process.env.VAULT_CERTS_PATH!,
    url: process.env.VAULT_URL!,
    appRoleId: process.env.VAULT_APP_ROLE_ID!,
    appSecret: process.env.VAULT_APP_ROLE_SECRET!,
    pathDb: process.env.VAULT_PATH_DATABASE!,
    pathKv: process.env.VAULT_PATH_KV!,
  },
};

export default () => config;
