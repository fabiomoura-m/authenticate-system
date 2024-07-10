import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Navbar from '@/app/(protected)/settings/_components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Settings Page',
    description: 'Learning NEXT_AUTH'
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <SessionProvider session={session}>
                <Navbar />
                {children}
            </SessionProvider>
        </div>
    );
}
