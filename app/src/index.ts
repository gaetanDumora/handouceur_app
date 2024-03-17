import dotenv from "dotenv";
import { prismaReadOnly } from "./clients";

dotenv.config();

try {
  const prismaRead = await prismaReadOnly();
  const user = await prismaRead.users.findMany();
  console.log(user);
} catch (error) {
  console.log(error);
}
