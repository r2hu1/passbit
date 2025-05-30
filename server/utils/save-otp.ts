import { Model } from "mongoose";
import { IOtpModel, OtpModel } from "~/models/otp";
import connectDB from "./db";

export default async function saveOtpForUser(userId: string, otp: string) {
  await connectDB();
  const hashedOtp = encrypt(otp);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await OtpModel.deleteMany({ userId });
  await (OtpModel as Model<IOtpModel>).create({
    userId,
    otpHash: hashedOtp,
    expiresAt,
  });
}
