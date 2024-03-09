declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD_FILE: string;
      POSTGRES_USER_READER: string;
      POSTGRES_PASSWORD_READER: string;
      POSTGRES_USER_SECURE: string;
      POSTGRES_PASSWORD_SECURE: string;
      PGADMIN_DEFAULT_EMAIL: string;
      VAULT_CERTS_PATH: string;
      VAULT_URL: string;
      VAULT_APP_ROLE_ID: string;
      VAULT_APP_SECRET_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
