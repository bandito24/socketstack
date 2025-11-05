import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {auth} from "../../../server/auth.ts";
import {ChatSidebar} from "@/app/(auth)/rooms/ChatSidebar.tsx";
import {RoomProvider} from "@/contexts/RoomProvider.tsx";
import {SocketProvider} from "@/contexts/SocketProvider.tsx";


export default async function AuthLayout({children}: { children: ReactNode }) {


    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session) {
        redirect('/login')
    }

    return (
        <>
            <RoomProvider>
                <SocketProvider>
                    <ChatSidebar
                    />
                    {children}
                </SocketProvider>
            </RoomProvider>

        </>
    )
}