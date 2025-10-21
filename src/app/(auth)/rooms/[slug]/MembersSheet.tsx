'use client'
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Users} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useQuery} from "@tanstack/react-query";
import {Room} from "@/contexts/RoomProvider.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {useEffect} from "react";

interface MembersSheetProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room;
}

export function MembersSheet({
                                 isOpen,
                                 onClose,
                                 room,
                             }: MembersSheetProps) {

    const {data: members} = useQuery({
        queryFn: async () =>{
            console.log('hi')
            const res = await ServerRequest.get(`/rooms/${room.slug}/room_users`)
            console.log(res);
            return res
        },
        queryKey: ['room', room.id, 'members'],
    })

    const {name: chatRoomName} = room




    const activeMembers = [];
    const inactiveMembers = [];
    // const activeMembers = members.filter((m) => m.isActive);
    // const inactiveMembers = members.filter((m) => !m.isActive);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Members</SheetTitle>
                    <SheetDescription>{chatRoomName}</SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                    <div className="space-y-6">
                        {/* Active Members */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm text-muted-foreground">
                                    Active — {activeMembers.length}
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {activeMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarFallback style={{ backgroundColor: member.avatarColor }}>
                                                    {member.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                        </div>
                                        <div className="flex-1">
                                            <p>{member.name}</p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            Active
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inactive Members */}
                        {inactiveMembers.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="text-sm text-muted-foreground">
                                        Offline — {inactiveMembers.length}
                                    </h4>
                                </div>
                                <div className="space-y-2">
                                    {inactiveMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <div className="relative">
                                                <Avatar className="opacity-60">
                                                    <AvatarFallback style={{ backgroundColor: member.avatarColor }}>
                                                        {member.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-muted-foreground rounded-full border-2 border-background" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-muted-foreground">{member.name}</p>
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