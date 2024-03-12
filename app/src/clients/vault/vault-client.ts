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

// Login as nodejs-app role policy
const vaultLogin = async () => {
  const vault = nodeVault({
    apiVersion: "v1",
    endpoint: process.env.VAULT_URL,
  });
  try {
    const { auth } = await vault.approleLogin({
      role_id: process.env.VAULT_APP_ROLE_ID,
      secret_id: process.env.VAULT_APP_SECRET_ID,
    });
    if (auth?.client_token) {
      vault.token = auth.client_token;
    }
  } catch (error) {
    console.log(error);
    return vault;
  }
  return vault;
};

export const usePgRole = async (
  role: "ro" | "rwd"
): Promise<{ username: string; password: string }> => {
  const vault = await vaultLogin();
  const { data } = await vault.read(`database/creds/${role}`);
  return data;
};
