'use client'
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar} from "@radix-ui/react-avatar";
import {AvatarFallback} from "@/components/ui/avatar.tsx";
import {getAvatarLetters} from "@/lib/utils.ts";
import {Users} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {useRoomSearchStore} from "@/hooks/useRoomSearchStore.ts";

export default function RoomResults({rooms}: { rooms: Room[] }) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<undefined | string>(undefined)
    const router = useRouter()
    const {rooms: existingRooms} = useRoomContext();
    const existingIds = new Set(existingRooms.map(room => room.id))
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([])

    const search = useRoomSearchStore((state) => state.search)
    useEffect(() => {
        setFilteredRooms(rooms.filter(room => room.name.toLowerCase().startsWith((search ?? '').toLowerCase(), 0)))
    }, [search])


    const handleJoinRoom = useMutation({
        mutationFn: async (name: string) => {
            return await ServerRequest.post('rooms/room_users', {name})
        },
        onError: (err) => ServerRequest.handleServerError(err, setServerError, `An unexpected event occurred in joining this room`),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['rooms']})
            router.push(`/rooms/${data?.room?.slug}`)
        }
    })

    return (

        <>
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                    {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} available
                </p>
            </div>
            <div className="absolute">
                <ErrorMessage message={serverError}/>
            </div>

            <div className="flex-1 overflow-y-scroll">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {filteredRooms.map((room: Room) => (
                        <Card
                            key={room.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer group"
                        >
                            <CardHeader>
                                <div className="flex items-start gap-3">

                                    <Avatar className="mt-1 h-10 w-10">
                                        <AvatarFallback style={{backgroundColor: room.avatar_color}}>
                                            {getAvatarLetters(room.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle data-testid="room-result" className="truncate">{room.name}</CardTitle>

                                        </div>
                                        <div
                                            className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-3.5 w-3.5"/>
                                            <span>{room.total_members}</span>

                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="line-clamp-3">
                                    {room.description || "No description provided"}
                                </CardDescription>
                                {!existingIds.has(room.id) ?
                                    <Button
                                        className="w-full mt-4 group-hover:bg-primary transition-colors"
                                        variant="outline"
                                        onClick={() => handleJoinRoom.mutate(room.name)}
                                    >
                                        Join Room
                                    </Button>
                                    :
                                    <p className="w-full mt-4 text-left text-sm text-muted-foreground">
                                        Already joined
                                    </p>
                                }

                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}

