import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/UserModel';
import sendEmailVerificationOTP from '@/lib/sendEmailVeryfiOTP';
import { ConnectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await ConnectDB();
        // Extract request body parameters
        const reqBody = await req.json();
        const { name, email, password } = reqBody;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return NextResponse.json({ status: "failed", message: "All fields are required" }, { status: 400 });
        }

        // Check if password and password_confirmation match
        // if (password !== password_confirmation) {
        //     return res.status(400).json({ status: "failed", message: "Password and Confirm Password don't match" });
        // }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ status: "failed", message: "Email already exists" }, { status: 409 });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await new UserModel({ name, email, password: hashedPassword }).save();

        sendEmailVerificationOTP(req, newUser);

        // Send success response
        return NextResponse.json({
            status: "success",
            message: "Registration Success",
            user: { id: newUser._id, email: newUser.email }
        }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: "failed", message: "Unable to Register, please try again later" }, { status: 500 });
    }
}
