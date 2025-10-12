'use client'
import LogoutButton from "@/app/(no-auth)/LogoutButton.tsx";
import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import useClientAuthSession from "@/utils/useClientAuthSession.tsx";

export default function AuthButtons() {
    const {data: session} = useClientAuthSession()
    const signedIn = !!session

    return (
        <>
            {!signedIn ? (
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                ) :
                <LogoutButton/>
            }
        </>
    )
}