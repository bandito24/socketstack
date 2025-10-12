'use client'
import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {useRouter} from "next/navigation";

export default function LogoutButton(){
    const router = useRouter()

    async function handleLogout(){
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // redirect to login page
                },
            },
        });
    }

    return (
        <Button onClick={() => handleLogout()}>Logout</Button>
    )
}