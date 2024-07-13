"use client"
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
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const ForgetPassword = () => {
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        email: '',
    });

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const onSubmit = async () => {
        setLoading(true);

        // Client-side validation
        if (!validateEmail(user.email)) {
            toast.error('Invalid email format');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/user/userResetPassEmail', user);
            if (response.data.success) {
                toast.success('Email sent successfully'); // Show success toast
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [user]);

    return (
        <Card className="w-[400px] z-10">
            <Toaster />
            <CardHeader className="flex items-center">
                <CardTitle>Forget Password</CardTitle>
                <CardDescription>Enter your recovery email</CardDescription>
            </CardHeader>
            <CardContent className="">
                <Label className="p-2">Email</Label>
                <Input
                    className='bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                    placeholder='Enter Email'
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="button"
                    onClick={onSubmit}
                    disabled={disabled || loading}
                >
                    {loading ? 'Loading...' : 'Send Email'}
                    <BottomGradient />
                </Button>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <div>Did you remember password? <Link href={"/login"} className=" text-blue-500">Login</Link></div>
            </CardFooter>
        </Card>
    )
}

export default ForgetPassword;

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
