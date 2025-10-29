import {Button} from "@/components/ui/button.tsx";
import {Bell, Search, Settings, User} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import AuthButtons from "@/components/header/AuthButtons.tsx";
import UserButton from "@/components/header/UserButton.tsx";

export default function Header() {
    return (
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white">S</span>
                </div>
                <h1 className="text-gray-900">SocketStack</h1>
            </div>

            <div className="flex items-center gap-2">
                {/* Search Button */}
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                    <Search className="h-5 w-5"/>
                </Button>

                {/* Notifications Button */}
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 relative">
                    <Bell className="h-5 w-5"/>
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                {/* Settings Button */}
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                    <Settings className="h-5 w-5"/>
                </Button>

                {/* User Profile Menu */}
                <UserButton/>
            </div>
        </header>

    )
}