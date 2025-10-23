import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {auth} from "../../../server/auth.ts";
import {ChatSidebar} from "@/app/(auth)/rooms/ChatSidebar.tsx";
import {RoomProvider} from "@/contexts/RoomProvider.tsx";


export default async function AuthLayout({children}: { children: ReactNode }) {


    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session) {
        redirect('/login')
    }

    return (
        <>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-80 flex flex-col overflow-hidden">
                        <ChatSidebar
                        />
                    </div>
                    {children}
                </div>
        </>
    )
}