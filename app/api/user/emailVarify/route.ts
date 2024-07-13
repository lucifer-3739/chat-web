import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/UserModel';
import EmailVerificationModel from '@/models/EmailVerification';
import sendEmailVerificationOTP from '@/lib/sendEmailVeryfiOTP';
import mongoose from 'mongoose';
import { ConnectDB } from '@/lib/db';

interface RequestBody {
    email: string;
    otp: number;
}

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        // Ensure mongoose is connected before querying
        if (mongoose.connection.readyState !== 1) {
            return NextResponse.json({ status: "failed", message: "Database connection error" }, { status: 500 });
        }

        const reqBody: RequestBody = await req.json();
        const { email, otp } = reqBody;

        // Check if all required fields are provided
        if (!email || !otp) {
            return NextResponse.json({ status: "failed", message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });

        // Check if email doesn't exist
        if (!existingUser) {
            return NextResponse.json({ status: "failed", message: "Email doesn't exist" }, { status: 400 });
        }

        // Check if email is already verified
        if (existingUser.is_verified) {
            return NextResponse.json({ status: "failed", message: "Email is already verified" }, { status: 400 });
        }

        // Check if there is a matching email verification OTP
        const emailVerification = await EmailVerificationModel.findOne({ userId: existingUser._id, otp });
        if (!emailVerification) {
            await sendEmailVerificationOTP(req, existingUser);
            return NextResponse.json({ status: "failed", message: "Invalid OTP, new OTP sent to your email" }, { status: 400 });
        }

        // Check if OTP is expired
        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmailVerificationOTP(req, existingUser);
            return NextResponse.json({ status: "failed", message: "OTP expired, new OTP sent to your email" }, { status: 400 });
        }

        // OTP is valid and not expired, mark email as verified
        existingUser.is_verified = true;
        await existingUser.save();

        // Delete email verification document
        await EmailVerificationModel.deleteMany({ userId: existingUser._id });

        return NextResponse.json({ status: "success", message: "Email verified successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "failed", message: "Unable to verify email, please try again later" }, { status: 500 });
    }
}
