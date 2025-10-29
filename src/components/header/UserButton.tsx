import {DropdownMenu, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {User} from "lucide-react";
import AuthButtons from "@/components/header/AuthButtons.tsx";

export default function UserButton() {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                    <User className="h-5 w-5"/>
                </Button>
            </DropdownMenuTrigger>
            <AuthButtons/>
        </DropdownMenu>
    )
}