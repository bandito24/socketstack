'use client'
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useRoomSearchStore} from "@/hooks/useRoomSearchStore.ts";

export default function HubSearchInput(){
    const setSearch = useRoomSearchStore(state => state.setSearch)

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
                onChange={e => setSearch(e.currentTarget.value)}
                placeholder="Search rooms by name..."
                className="pl-9"
            />
        </div>
    )
}