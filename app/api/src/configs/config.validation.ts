import * as Joi from 'joi';
export const validationSchema = Joi.object({
  ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().port().required(),
  VAULT_URL: Joi.string().required(),
  VAULT_CERTS_PATH: Joi.string().required(),
  VAULT_APP_ROLE_ID: Joi.string().required(),
  VAULT_APP_ROLE_SECRET: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().required(),
  DATABASE_NAME: Joi.string().required(),
});
