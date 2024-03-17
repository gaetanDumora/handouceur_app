import nodeVault from "node-vault";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { globalAgent } from "https";

dotenv.config();
const cert = readFileSync(`${process.env.VAULT_CERTS_PATH}/selfsigned.crt`);
globalAgent.options.ca = cert;

type vaultAuth =
  | undefined
  | {
      auth: {
        client_token: string;
        accessor: string;
        policies: string[];
        token_policies: string[];
        metadata: Record<string, unknown>;
        lease_duration: number;
        renewable: boolean;
        entity_id: string;
        token_type: string;
        orphan: boolean;
        mfa_requirement: string | null;
        num_uses: number;
      };
    };

type databaseCredentials = { data: { username: string; password: string } };

let vaultInstance: nodeVault.client;

// Login with nodejs-app role policy
const vaultLogin = async () => {
  if (vaultInstance) {
    return vaultInstance;
  }

  vaultInstance = nodeVault({
    apiVersion: "v1",
    endpoint: process.env.VAULT_URL,
  });

  const vaultAppRole: vaultAuth = await vaultInstance.approleLogin({
    role_id: process.env.VAULT_APP_ROLE_ID,
    secret_id: process.env.VAULT_APP_SECRET_ID,
  });

  if (!vaultAppRole?.auth?.client_token) {
    throw new Error("[vault]: failed to login to Vault");
  }
  vaultInstance.token = vaultAppRole.auth.client_token;
  return vaultInstance;
};

export const usePgRole = async (role: "ro" | "rwd") => {
  const vault = await vaultLogin();
  const credentials: databaseCredentials = await vault.read(
    `database/creds/${role}`
  );
  if (!credentials.data) {
    throw new Error(`[vault]: failed to read database/creds/${role}`);
  }
  return credentials.data;
};
