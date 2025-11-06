'use client'
import {Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import React from "react";
import {useDisplayComponentStore} from "@/hooks/useDisplayComponentStore.ts";
import useClientAuthSession from "@/utils/useClientAuthSession.tsx";
import {getAvatarLetters} from "@/lib/utils.ts";
import {formatDistanceToNow} from "date-fns";

export default function ProfileSheet(){
    const showProfile = useDisplayComponentStore((state) => state.showProfile)
    const setShowProfile = useDisplayComponentStore((state) => state.setShowProfile)
    const {data} = useClientAuthSession();

    if(!data?.user){
        return null
    }
    const { user } = data as unknown as { user: {createdAt: string, username: string, avatar_color: string } };

    const onClose = () => setShowProfile(false);


    return (
        <Sheet open={showProfile} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Profile</SheetTitle>
                    <SheetDescription>
                        Your SocketStack profile information
                    </SheetDescription>




                </SheetHeader>

                <div className="mt-8 flex flex-col items-center gap-6 p-4">
                    {/* Avatar */}
                    <Avatar className="h-24 w-24">
                        <AvatarFallback style={{ backgroundColor: user.avatar_color}}>
                            <span className="text-white text-4xl">{getAvatarLetters(user.username ?? '')}</span>
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="w-full space-y-4">
                        <div className="space-y-1">
                            <p className="text- text-gray-500">Username</p>
                            <p className="">{user.username}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Created</p>
                            <p className="">{formatDistanceToNow(user.createdAt, {addSuffix: true})}</p>
                        </div>
                    </div>


                    {/* Additional Info */}
                    <div className="w-full pt-4 text-sm text-gray-500">
                        <p>
                            Remember: SocketStack is completely anonymous. Your conversations are never stored on our servers.
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    )
}