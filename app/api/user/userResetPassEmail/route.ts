import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserModel from '@/models/UserModel';
import transporter from '@/lib/emailConfig';
import { ConnectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const reqBody = await req.json();
        const { email } = reqBody;

        // Check if email is provided
        if (!email) {
            return NextResponse.json({ status: "failed", message: "Email field is required" }, { status: 400 });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ status: "failed", message: "Email doesn't exist" }, { status: 404 });
        }

        // Generate token for password reset
        const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' });

        // Reset Link
        const resetLink = `${process.env.FRONTEND_HOST}/resetPass?id=${user._id}&token=${token}`;

        // Send password reset email  
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Password Reset Link",
            html: `<p>Hello ${user.name},</p><br><p>Please <a href="${resetLink}">click here</a> to reset your password.</p>`
        });

        // Send success response
        return NextResponse.json({ status: "success", message: "Password reset email sent. Please check your email." }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "failed", message: "Unable to send password reset email. Please try again later." }, { status: 500 });
    }
}
