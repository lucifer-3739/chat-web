'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const ResetPass = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({
        password: '',
        confirm_password: ''
    });

    // Extract id and token from the URL query parameters
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    const onSubmit = async () => {
        setLoading(true);

        // Client-side validation
        if (user.password.length < 8 || user.password !== user.confirm_password) {
            toast.error('Passwords must match and be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            // Log the URL parameters
            console.log("ID:", id);
            console.log("Token:", token);

            if (!id || !token) {
                toast.error('Invalid request parameters');
                setLoading(false);
                return;
            }

            const data = { id, token, password: user.password, password_confirmation: user.confirm_password };
            console.log("Submitting data:", data); // Log the data being sent

            const response = await axios.post(`/api/user/userPassReset`, data);
            console.log("API Response:", response.data); // Log the response from the API

            if (response.data && response.data.status === "success") {
                toast.success(response.data.message);
                router.push('/login');
            } else {
                toast.error(response.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error("API Error:", error); // Log the detailed error message
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setDisabled(!(user.password.length > 0 && user.confirm_password.length > 0));
    }, [user]);

    return (
        <Card className="w-[400px] z-10">
            <Toaster />
            <CardHeader className="flex items-center">
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your Password</CardDescription>
            </CardHeader>
            <CardContent>
                <Label className="p-2">New Password</Label>
                <div className="relative">
                    <Input
                        className="bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 pr-10"
                        placeholder="Enter Password"
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                <Label className="p-2">Confirm New Password</Label>
                <div className="relative">
                    <Input
                        className="bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 pr-10"
                        placeholder="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        value={user.confirm_password}
                        onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="button"
                    onClick={onSubmit}
                    disabled={disabled || loading}
                >
                    {loading ? 'Loading...' : 'Reset Password'}
                    <BottomGradient />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ResetPass;

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
