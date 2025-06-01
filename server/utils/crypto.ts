import dotenv from "dotenv";
import {
  encrypt as scEncrypt,
  decrypt as scDecrypt,
} from "@tsmx/string-crypto";
import bcrypt from "bcryptjs";
dotenv.config();

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
  throw new Error("Encryption key is not set");
}

export const encrypt = (data: string): string => {
  return scEncrypt(data, { key: encryptionKey });
};

export const decrypt = (data: string): string => {
  return scDecrypt(data, { key: encryptionKey });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
