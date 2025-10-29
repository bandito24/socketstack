import {RoomProvider} from "@/contexts/RoomProvider.tsx";
import {ReactNode} from "react";
import {SocketProvider} from "@/contexts/SocketProvider.tsx";

export default function RoomLayout({children}: { children: ReactNode }) {

    return (
        <>

                {children}
        </>



    )
}