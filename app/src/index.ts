import dotenv from "dotenv";
dotenv.config();
import { prismaRO, prismaRWD } from "./clients/prisma/prima-client";

try {
  const prismaRead = await prismaRO();
  const prima = await prismaRWD();
  const user = await prismaRead.users.findMany();
  console.log(user);
} catch (error) {
  console.log(error);
}
