import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header.tsx";
import {SocketProvider} from "@/contexts/SocketProvider.tsx";
import ReactQueryProvider from "@/contexts/ReactQueryProvider.tsx";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SocketStack",
    description: "Socket Communication Channel",
    icons: {
        icon: "/favicon.png",
    },
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-auto`}
        >
        <div className="size-full flex flex-col h-screen">
            <ReactQueryProvider>
                <SocketProvider>
                    <Header/>
                    {children}
                </SocketProvider>
            </ReactQueryProvider>
        </div>
        </body>
        </html>
    );
}
