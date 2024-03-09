import dotenv from "dotenv";
dotenv.config();
import { log } from "./utils";
import { getDbUser } from "./vault/vault";

try {
  // await vaultInit();
  await getDbUser();
} catch (error) {
  console.log(error);
}
