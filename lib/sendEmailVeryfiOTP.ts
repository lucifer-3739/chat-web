import transporter from "@/lib/emailConfig";
import EmailVerificationModel from "@/models/EmailVerification";
import { NextRequest } from "next/server";

interface User {
    _id: string;
    email: string;
    name: string;
}

const sendEmailVerificationOTP = async (req: NextRequest, user: User): Promise<number> => {
    // Generate a random 4-digit number
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Save OTP in Database
    await new EmailVerificationModel({ userId: user._id, otp: otp }).save();

    // OTP Verification Link
    const otpVerificationLink = `${process.env.FRONTEND_HOST}/verifyemail`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM as string,
        to: user.email,
        subject: "OTP - Verify your account",
        html: `
      <p>Dear ${user.name},</p><br>
      <p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP):</p><br>
      <h2>OTP: ${otp}</h2>
      <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>
      <p>Verification Link: <a href="${otpVerificationLink}">${otpVerificationLink}</a></p>
    `,
    });

    return otp;
}

export default sendEmailVerificationOTP;
