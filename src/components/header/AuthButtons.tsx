'use client'
import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import useClientAuthSession from "@/utils/useClientAuthSession.tsx";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {Settings, User} from "lucide-react";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client.ts";
import {useDisplayComponentStore} from "@/hooks/useDisplayComponentStore.ts";

export default function AuthButtons() {
    const {data: session} = useClientAuthSession()

    const setShowProfile = useDisplayComponentStore((state) => state.setShowProfile)
    const signedIn = !!session

   if (signedIn){
       return (
           <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator/>
               <DropdownMenuItem onClick={() => setShowProfile(true)}>
                   <User className="mr-2 h-4 w-4"/>
                   <span>Profile</span>
               </DropdownMenuItem>
               <DropdownMenuItem>
                   <Settings className="mr-2 h-4 w-4"/>
                   <span>Settings</span>
               </DropdownMenuItem>
               <LogoutButton />
               <DropdownMenuSeparator/>

           </DropdownMenuContent>
       )

   } else {
       return (
           <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuItem asChild>
                   <Link href={"/login"}>Log In</Link>
               </DropdownMenuItem>
           </DropdownMenuContent>
       )
   }
}


function LogoutButton(){
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
        <DropdownMenuItem onClick={() => handleLogout()}>
            <span>Log out</span>
        </DropdownMenuItem>
    )
}