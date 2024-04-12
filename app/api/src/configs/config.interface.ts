export interface Config {
  nest: NestConfig;
  database: DatabaseConfig;
  vault: VaultConfig;
}

export interface NestConfig {
  port: number | string;
  env: string;
}

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number | string;
  name: string;
}
export interface VaultConfig {
  certsPath: string;
  url: string;
  appRoleId: string;
  appSecret: string;
  pathKv: string;
  pathDb: string;
}

export interface EnvironmentVariables {
  ENV: string;
  PORT: string;
  VAULT_URL: string;
  VAULT_CERTS_PATH: string;
  VAULT_APP_ROLE_ID: string;
  VAULT_APP_ROLE_SECRET: string;
  VAULT_PATH_KV: string;
  VAULT_PATH_DATABASE: string;
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_NAME: string;
}
