'use client'
import Link from "next/link";
import {Radio} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {usePathname} from "next/navigation";
import {clsx} from "clsx";

export default function HubButton(){
    const pathName = usePathname();

    return (
        <Button asChild
                variant="ghost"
                size="sm"
                className=" gap-2"
        >
            <Link href={'/hub'}>
                <Radio className={clsx('h-4 w-4',
                    pathName.endsWith('hub') && 'text-ring'
                    )} />

                <span  className={clsx("hidden sm:inline",
                    pathName.endsWith('hub') && 'text-ring'
                    )}>Room Hub</span>
            </Link>
        </Button>
    )
}