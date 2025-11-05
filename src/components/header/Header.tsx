import {Button} from "@/components/ui/button.tsx";
import {Bell, Radio, Search, Settings, User} from "lucide-react";
import UserButton from "@/components/header/UserButton.tsx";
import Link from "next/link";
import {ModeToggle} from "@/app/components/ModeToggle.tsx";
import HubButton from "@/components/header/HubButton.tsx";

export default function Header() {
    return (
        <header className="h-[60px] border-b border-border flex items-center justify-between px-4">
            <Link className="flex items-center gap-2" href={"/"}>
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white">S</span>
                </div>
                <h1 className="">SocketStack</h1>
            </Link>

            <div className="flex items-center gap-2">
                <HubButton/>

                <ModeToggle/>

                {/*/!* Notifications Button *!/*/}
                {/*<Button variant="ghost" size="icon" className=" relative">*/}
                {/*    <Bell className="h-5 w-5"/>*/}
                {/*    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>*/}
                {/*</Button>*/}


                {/* User Profile Menu */}
                <UserButton/>
            </div>
        </header>

    )
}