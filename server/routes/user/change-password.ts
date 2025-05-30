import { Model } from "mongoose";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  if (!email || !password) {
    return createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }
  try {
    await connectDB();
    const user = await (User as Model<IUser>).findOne({ email });
    if (!user) {
      return createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    user.password = encrypt(password);
    await user.save();
    return {
      error: false,
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
