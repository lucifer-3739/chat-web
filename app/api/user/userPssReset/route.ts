import { NextRequest, NextResponse } from 'next/server';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/UserModel';
import { ConnectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const reqBody = await req.json();
        const { id, token, password, password_confirmation } = reqBody;

        if (!id || !token) {
            return NextResponse.json({ status: "failed", message: "Invalid request parameters" }, { status: 400 });
        }

        // Find user by ID
        const user = await UserModel.findById(id);
        if (!user) {
            return NextResponse.json({ status: "failed", message: "User not found" }, { status: 404 });
        }

        // Validate token
        const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        try {
            jwt.verify(token, new_secret);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return NextResponse.json({ status: "failed", message: "Token expired. Please request a new password reset link." }, { status: 400 });
            } else if (error instanceof JsonWebTokenError) {
                return NextResponse.json({ status: "failed", message: "Invalid token. Please request a new password reset link." }, { status: 400 });
            }
            throw error; // rethrow other JWT errors
        }

        // Check if password and password_confirmation are provided
        if (!password || !password_confirmation) {
            return NextResponse.json({ status: "failed", message: "New Password and Confirm New Password are required" }, { status: 400 });
        }

        // Check if password and password_confirmation match
        if (password !== password_confirmation) {
            return NextResponse.json({ status: "failed", message: "New Password and Confirm New Password don't match" }, { status: 400 });
        }

        // Generate salt and hash new password
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        // Update user's password
        await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });

        // Send success response
        return NextResponse.json({ status: "success", message: "Password reset successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "failed", message: "Unable to reset password. Please try again later." }, { status: 500 });
    }
}
