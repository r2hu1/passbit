import { Model } from "mongoose";
import Pwd, { IPwd } from "~/models/password";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.user;

    const { password, name, email, username } = await readBody(event);

    await connectDB();
    const isUserVerified = await (User as Model<IUser>).findById(id);
    if (isUserVerified.status != "verified") {
      return createError({
        statusCode: 400,
        statusMessage: "Please verify your email address",
      });
    }

    const newPwd = await (Pwd as Model<IPwd>).create({
      name: name || "My Account",
      email: email || null,
      password: password,
      username: username || null,
      owner: id,
    });

    await (User as Model<IUser>).findByIdAndUpdate(
      id,
      {
        $push: { savedPasswords: newPwd._id },
      },
      { new: true },
    );

    return {
      success: true,
      error: false,
      saved: {
        name: newPwd.name,
        username: newPwd.username,
        email: newPwd.email,
        password: newPwd.password,
      },
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
