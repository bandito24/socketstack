import useRoomContext, {RoomProvider} from "@/contexts/RoomProvider.tsx";
import {ReactNode} from "react";
import RoomList from "@/app/(auth)/rooms/RoomList.tsx";

export default function RoomLayout({children}: { children: ReactNode }) {

    return (
        <RoomProvider>
            <div>
                <h1 className="my-10 text-center font-bold text-3xl">Welcome to SocketStack</h1>
            <div className="grid grid-cols-[.5fr_1fr] grid-rows-1">
                <RoomList/>
                <div>
                    {children}
                </div>
            </div>
            </div>
        </RoomProvider>

    )
}