import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header.tsx";
import {SocketProvider} from "@/contexts/SocketProvider.tsx";
import ReactQueryProvider from "@/contexts/ReactQueryProvider.tsx";
import ProfileSheet from "@/components/ProfileSheet.tsx";
import {ThemeProvider} from "@/contexts/ThemeProvider.tsx";

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
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen m-auto`}
        >

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="size-full flex flex-col h-screen">
                <ReactQueryProvider>
                    <Header/>

                    <div className="flex-1 flex overflow-hidden">
                        {children}
                    </div>

                        <ProfileSheet/>

                </ReactQueryProvider>
            </div>

        </ThemeProvider>
        </body>
        </html>
    );
}
