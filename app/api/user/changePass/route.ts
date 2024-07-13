import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/UserModel';
import { ConnectDB } from '@/lib/db';
import jwt, { TokenExpiredError, JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        // Retrieve token from cookies or headers
        const token = req.cookies.get('token') || (req.headers.get('authorization')?.split(' ')[1] as string);

        if (!token) {
            return NextResponse.json({ status: 'failed', message: 'Unauthorized: Token not found in cookie or header' }, { status: 401 });
        }

        // Verify token and get user ID
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return NextResponse.json({ status: 'failed', message: 'Token expired. Please log in again.' }, { status: 401 });
            }
            return NextResponse.json({ status: 'failed', message: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.id;

        // Continue with password change logic

        const { password, password_confirmation } = await req.json();

        // Check if password and password_confirmation are provided
        if (!password || !password_confirmation) {
            return NextResponse.json({ status: 'failed', message: 'New Password and Confirm New Password are required' }, { status: 400 });
        }

        // Check if password and password_confirmation match
        if (password !== password_confirmation) {
            return NextResponse.json({ status: 'failed', message: "New Password and Confirm New Password don't match" }, { status: 400 });
        }

        // Generate salt and hash new password
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        // Update user's password
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: { password: newHashPassword } }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ status: 'failed', message: 'User not found' }, { status: 404 });
        }

        // Send success response
        return NextResponse.json({ status: 'success', message: 'Password changed successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error in password change:', error);
        return NextResponse.json({ status: 'failed', message: 'Unable to change password, please try again later' }, { status: 500 });
    }
}
