import {Button} from "@/components/ui/button.tsx";
import Link from "next/link";
import useClientAuthSession from "@/utils/useClientAuthSession.tsx";
import {getServerAuthSession} from "@/utils/getServerAuthSession.tsx";

export default async function RoomPage() {
    const data = await getServerAuthSession()


    return (
        <div className="flex flex-col w-1/2 items-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
                {"hi " + data!.user.name}
            </h2>

            <div className="flex justify-around">
                <Button asChild>
                    <Link href={"/rooms/create"}>
                        Create Room
                    </Link>
                </Button>
                <Button asChild><Link href={"/rooms/join"}>
                    Join New Room
                </Link></Button>
            </div>

        </div>
    )
}