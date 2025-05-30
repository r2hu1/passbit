import { Model } from "mongoose";
import nodemailer from "nodemailer";
import User, { IUser } from "~/models/user";
import connectDB from "~/utils/db";
import saveOtpForUser from "~/utils/save-otp";

export default defineEventHandler(async (event) => {
  const { email, id } = event.context.user;
  await connectDB();
  const userStatus = await (User as Model<IUser>).findById({ _id: id });
  if (userStatus.status != "unverified") {
    return createError({
      statusCode: 400,
      statusMessage: "User is already verified",
    });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verification code to verify your email address",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          background: #f4f4f7;
          padding: 20px;
          text-align: center;
        ">
          <div style="
            background: white;
            max-width: 400px;
            margin: auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">
            <h2 style="color: #333;">Your Verification Code</h2>
            <p style="font-size: 16px; color: #555;">
              Use the code below to verify your email address.
            </p>
            <p style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 4px;
              color: #2E86DE;
              margin: 20px 0;
            ">
              ${code}
            </p>
            <p style="font-size: 14px; color: #999;">
              This code will expire in 10 minutes.
            </p>
          </div>
        </div>
      `,
    });

    await saveOtpForUser(event.context.user.id, code);
    return {
      success: true,
      error: false,
      statusCode: 200,
    };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to send email",
    });
  }
});
