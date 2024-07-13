'use client';

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const handleOtpChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) (nextInput as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);

            if (!otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) (prevInput as HTMLInputElement).focus();
            }
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        if (!validateEmail(user.email)) {
            toast.error('Invalid email format');
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/user/emailVarify', { email: user.email, otp: parseInt(otp.join('')) });
            if (response.data.status === 'success') {
                toast.success(response.data.message);
                router.push('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);

    return (
        <Card className="w-[400px] z-10 max-w-md rounded-lg shadow-xl">
            <CardHeader className="text-center font-bold">
                Verify your account
            </CardHeader>
            <CardDescription className="text-center mb-4 text-gray-400">
                Check your email for OTP.<br /> OTP is valid for 15 minutes.
            </CardDescription>
            {loading && (
                <Alert className="text-center text-white">
                    Verifying your email, please wait...
                </Alert>
            )}
            <CardContent>
                <div className="mb-2">
                    <label htmlFor="email" className="block font-medium mb-2">
                        Email
                    </label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={user.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div className="flex space-x-2 mb-2">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 text-center"
                            pattern="\d*"
                            disabled={loading}
                        />
                    ))}
                </div>
                <Button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Verify →'}
                    <BottomGradient />
                </Button>
            </CardContent>
        </Card>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
