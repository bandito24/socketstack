import useRoomContext, {RoomProvider} from "@/contexts/RoomProvider.tsx";
import {ReactNode} from "react";
import RoomList from "@/app/(auth)/rooms/RoomList.tsx";

export default function RoomLayout({children}: {children: ReactNode}){

    return (
        <RoomProvider>
            <RoomList />
            {children}
        </RoomProvider>

    )
}