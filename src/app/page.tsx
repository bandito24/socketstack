'use client';
import {User} from "better-auth";
import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import LogoutButton from "@/app/(no-auth)/LogoutButton.tsx";

export default function Home() {
    const {data: sess} = authClient.useSession()


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-6 rounded-lg bg-white p-10 shadow-lg">
                {sess?.user ? (
                    <div className="flex flex-col w-1/2 items-center space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            {"hi " + sess.user.name}
                        </h2>
                        <LogoutButton/>

                        <div className="flex justify-around">
                        <Button asChild>
                            <Link href={"/rooms/create"}>
                            Create Room
                            </Link>
                            </Button>
                        <Button disabled>Join Room</Button>
                        </div>

                    </div>
                ) : (
                    <Button asChild>
                        <Link href="(no-auth)/login">Login</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}






