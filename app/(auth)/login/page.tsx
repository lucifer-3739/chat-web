"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';

const LoginForm = () => {
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState({
        email: '',
        password: '',
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
        if (user.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/user/login', user);
            if (response.data.success) {
                toast.success(response.data.message);
                // Redirect to another page after successful login, e.g., dashboard
                router.push('/');
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
        if (user.email.length > 0 && user.password.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [user]);

    return (
        <Card className="w-[400px] z-10">
            <Toaster />
            <CardHeader className="flex items-center">
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to Chat</CardDescription>
            </CardHeader>
            <CardContent className="">
                <Label className="p-2">Email</Label>
                <Input
                    className='bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                    placeholder='Enter Email'
                    value={user.email}
                    onChange={(e: any) => setUser({ ...user, email: e.target.value })}
                />
                <Label className="p-2">Password</Label>
                <Input
                    className='bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                    placeholder='Enter Password'
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e: any) => setUser({ ...user, password: e.target.value })}
                />
                <div className="flex items-center mt-2 p-1">
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2"
                    />
                    <label htmlFor="showPassword" className="text-sm text-gray-600 dark:text-gray-300">
                        Show Password
                    </label>
                </div>
                <div>
                    <Link href="/forgetpass">Forget Password?</Link>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="button"
                    onClick={onSubmit}
                    disabled={disabled || loading}
                >
                    {loading ? 'Loading...' : 'Login →'}
                    <BottomGradient />
                </Button>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                <div>Don't have an account? <Link href={"/register"} className=" text-blue-500">Register</Link></div>
            </CardFooter>
        </Card>
    )
}

export default LoginForm

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
