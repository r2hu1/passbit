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
    return {
      savedPasswords: user.savedPasswords,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
