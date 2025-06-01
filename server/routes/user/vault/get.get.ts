import { Model } from "mongoose";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.user;
    await connectDB();
    const user = await (User as Model<IUser>)
      .findById(id)
      .populate("savedPasswords");

    const decryptedSaved = user.savedPasswords.map((entry: any) => ({
      ...entry.toObject(),
      name: decrypt(entry.name),
      email: decrypt(entry.email),
      password: decrypt(entry.password),
    }));

    return {
      saved: decryptedSaved,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
