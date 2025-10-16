import {Button} from "@/components/ui/button.tsx";
import Link from "next/link";
import useClientAuthSession from "@/utils/useClientAuthSession.tsx";
import {getServerAuthSession} from "@/utils/getServerAuthSession.tsx";

export default async function RoomPage() {
    const data = await getServerAuthSession()


    return (
        <div className="h-full flex items-center justify-center bg-background">
            <div className="text-center text-muted-foreground">
                <p>Select a chat to start messaging</p>
            </div>
        </div>
    )
}