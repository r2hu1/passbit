import { Model } from "mongoose";
import User, { IUser } from "~/models/user";
import { generateEncryptedToken } from "~/utils/auth";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const user = await (User as Model<IUser>).findOne({ email: body.email });

  const isValid = await verifyPassword(body.password, user.password);
  if (!isValid) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Invalid credentials" }),
    );
  }

  const encryptedToken = generateEncryptedToken({
    id: user.id,
    email: user.email,
  });

  return { token: encryptedToken };
});
