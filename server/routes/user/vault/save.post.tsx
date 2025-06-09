import { Model } from "mongoose";
import Pwd, { IPwd } from "~/models/password";
import User, { IUser } from "~/models/user";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.user;

    const { password, name, email, username, note } = await readBody(event);

    const isUserVerified = await (User as Model<IUser>).findById(id);
    if (isUserVerified.status != "verified") {
      return createError({
        statusCode: 400,
        statusMessage: "Please verify your email address",
      });
    }

    const newPwd = await (Pwd as Model<IPwd>).create({
      name: name,
      email: email,
      password: password,
      username: username,
      note: note,
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
      added: newPwd,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
