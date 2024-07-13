import { ModeToggle } from '@/components/modetoggle';
// import { BackgroundBeams } from '@/components/ui/background-beams';
import React from 'react'
import Banner from '@/components/banner';

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <div className=''>
                {/* <BackgroundBeams /> */}
            </div>
            <div className='h-screen flex justify-center items-center relative z-10'>
                <Banner />
                <div className=' absolute top-6 right-6'>
                    <ModeToggle />
                </div>
                {children}
            </div>
        </>
    )
}

export default AuthLayout