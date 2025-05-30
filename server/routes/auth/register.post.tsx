import { Model } from "mongoose";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    await connectDB();
    const email = body.email;
    const password = body.password;
    await (User as Model<IUser>).create({
      email: email,
      password: password,
    });
    return { error: false, email: email };
  } catch (error) {
    return { error: true, message: error.message };
  }
});
