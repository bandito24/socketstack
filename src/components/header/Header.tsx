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
                <UserButton/>
            </div>
        </header>

    )
}