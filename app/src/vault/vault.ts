import nodeVault from "node-vault";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { globalAgent } from "https";

dotenv.config();
const cert = readFileSync(`${process.env.VAULT_CERTS_PATH}/selfsigned.crt`);
globalAgent.options.ca = cert;

const vault = nodeVault({
  apiVersion: "v1",
  endpoint: process.env.VAULT_URL,
});

export const getDbUser = async () => {
  const login = await vault.approleLogin({
    role_id: process.env.VAULT_APP_ROLE_ID,
    secret_id: process.env.VAULT_APP_SECRET_ID,
  });
  if (login.auth) {
    vault.token = login.auth.client_token;
    const { data } = await vault.read("database/creds/ro");
    console.log(data);
  }
};
