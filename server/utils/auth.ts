import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = process.env.JWT_SECRET || "super-secret";

export function generateEncryptedToken(payload: object): string {
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
  return encrypt(token);
}

export function verifyEncryptedToken(encryptedToken: string): any | null {
  try {
    const decrypted = decrypt(encryptedToken);
    return jwt.verify(decrypted, SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
