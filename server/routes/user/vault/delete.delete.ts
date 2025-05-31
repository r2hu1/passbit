import { Model } from "mongoose";
import Pwd, { IPwd } from "~/models/password";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = event.context.user;
    const { id: pwdId } = await readBody(event);

    await connectDB();
    const deletedPwd = await (Pwd as Model<IPwd>).findByIdAndDelete(pwdId);
    if (!deletedPwd) {
      return createError({
        statusCode: 404,
        statusMessage: "Password not found",
      });
    }

    await (User as Model<IUser>).findByIdAndUpdate(userId, {
      $pull: { savedPasswords: pwdId },
    });
    return {
      success: true,
      error: false,
      message: "Password deleted successfully",
      statusCode: 200,
    };
  } catch (error) {
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
