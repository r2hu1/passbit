import { Model } from "mongoose";
import { IOtpModel, OtpModel } from "~/models/otp";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";

export default defineEventHandler(async (event) => {
  await connectDB();
  const { otp } = await readBody(event);
  const { id } = event.context.user;

  const record = await (OtpModel as Model<IOtpModel>).findOne({ userId: id });

  if (!record) {
    return createError({ statusCode: 404, statusMessage: "OTP not found" });
  }

  if (record.expiresAt < new Date()) {
    await OtpModel.deleteOne({ id });
    return { success: false, message: "OTP expired" };
  }

  const isMatch = otp === decrypt(record.otpHash);
  if (!isMatch) {
    return createError({ statusCode: 400, statusMessage: "Invalid OTP" });
  }

  await OtpModel.deleteOne({ userId: id });
  await (User as Model<IUser>).updateOne({ _id: id }, { status: "verified" });
  return {
    success: true,
    message: "OTP verified successfully",
    statusCode: 200,
  };
});
