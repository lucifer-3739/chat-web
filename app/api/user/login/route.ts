import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/UserModel';
import { ConnectDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();

        const reqBody = await req.json();
        const { email, password } = reqBody;

        // Check if email and password are provided
        if (!email || !password) {
            return NextResponse.json({ status: 'failed', message: 'Email and password are required' }, { status: 400 });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Check if user exists
        if (!user) {
            return NextResponse.json({ status: 'failed', message: 'Invalid Email or Password' }, { status: 404 });
        }

        // Check if user is verified
        if (!user.is_verified) {
            return NextResponse.json({ status: 'failed', message: 'Your account is not verified' }, { status: 401 });
        }

        // Compare passwords / Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ status: 'failed', message: 'Invalid email or password' }, { status: 401 });
        }

        // Generate tokens
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        // Create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '7d' });

        // Create the response object and set cookies
        const response = NextResponse.json({
            message: `Welcome back ${user.name}`,
            success: true,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/', // Set the path to make the cookie available in all routes
            sameSite: 'strict', // Adjust according to your requirements
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 'failed', message: 'Unable to login, please try again later' }, { status: 500 });
    }
}
