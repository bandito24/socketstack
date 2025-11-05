'use client'
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Users} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useQuery} from "@tanstack/react-query";
import {Room} from "@/contexts/RoomProvider.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {useEffect, useState} from "react";
import {getAvatarLetters} from "@/lib/utils.ts";
import {username} from "better-auth/plugins";

interface MembersSheetProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room;
    memberStack: string[]
}

interface MembersDistType {
    inactiveMembers: RoomMember[],
    activeMembers: RoomMember[]
}

type RoomMember = { username: string, avatar_color: string }

export function MembersSheet({
                                 isOpen,
                                 onClose,
                                 room,
                                 memberStack,
                             }: MembersSheetProps) {

    const [membersDist, setMemberDist] = useState<MembersDistType>({inactiveMembers: [], activeMembers: []})

    const {data: fetchedMembers} = useQuery({
        queryFn: async () => {
            const res = await ServerRequest.get(`/rooms/${room.slug}/room_users`)
            return res
        },
        queryKey: ['room_users', room.id],
        enabled: isOpen
    })

    const {name: chatRoomName} = room


    useEffect(() => {
        if (!fetchedMembers) return

        const memberSet = new Set(memberStack)

        const active: RoomMember[] = [];
        const inactive: RoomMember[] = [];


        fetchedMembers.forEach((member: RoomMember) => {
            if (memberSet.has(member.username)) active.push(member)
            else inactive.push(member)
        })
        setMemberDist({inactiveMembers: inactive, activeMembers: active})


    }, [memberStack, fetchedMembers])


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Members</SheetTitle>
                    <SheetDescription>{chatRoomName}</SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-8rem)] mt-6 ml-2">
                    <div className="space-y-6">
                        {/* Active Members */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-4 w-4 text-muted-foreground"/>
                                <h4 className="text-sm text-muted-foreground">
                                    Active — {membersDist.activeMembers.length}
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {membersDist.activeMembers.map((member) => (
                                    <div
                                        key={member.username}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarFallback style={{backgroundColor: member.avatar_color}}>
                                                    {getAvatarLetters(member.username)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"/>
                                        </div>
                                        <div className="flex-1">
                                            <p>{member.username}</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            Active
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inactive Members */}
                        {membersDist.inactiveMembers.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="h-4 w-4 text-muted-foreground"/>
                                    <h4 className="text-sm text-muted-foreground">
                                        Offline — {membersDist.inactiveMembers.length}
                                    </h4>
                                </div>
                                <div className="space-y-2">
                                    {membersDist.inactiveMembers.map((member) => (
                                        <div
                                            key={member.username}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <div className="relative">
                                                <Avatar className="opacity-60">
                                                    <AvatarFallback style={{backgroundColor: member.avatar_color}}>
                                                        {getAvatarLetters(member.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div
                                                    className="absolute bottom-0 right-0 w-3 h-3 bg-muted-foreground rounded-full border-2 border-background"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-muted-foreground">{member.username}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Offline
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}