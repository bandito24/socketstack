'use client'
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ChevronRight, LogOut, MoreVertical, Send} from "lucide-react";
import {MembersSheet} from "@/app/components/MembersSheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MessageBubble} from "@/app/components/MessageBubble.tsx";
import {useEffect, useRef, useState} from "react";
import {mockMembers, mockMessages} from "@mytypes/next/chat.ts";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {useMutation} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";
import {useRouter} from "next/navigation";
import {getAvatarLetters} from "@/lib/utils.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {RoomEvent, ServerToClientEvents} from "@mytypes/IOTypes.ts";
import {authClient} from "@/lib/auth-client.ts";
import useSocketProvider from "@/contexts/SocketProvider.tsx";
import MakeNotification from "@/utils/MakeNotification.ts";



export function ChatWindow({room}: {room: Room}) {
    const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
    const [serverError, setServerError] = useState<undefined | string>(undefined)
    const {rooms, setRooms} = useRoomContext();
    const router = useRouter();


    const [isConnected, setIsConnected] = useState(false);
    const [roomEvents, setRoomEvents] = useState<RoomEvent[]>([])
    const [memberStack, setMemberStack] = useState<string[]>([])
    const syncRef = useRef<boolean>(false)
    const ROOM_ID = room.id.toString()
    const roomEventRef = useRef<RoomEvent[]>([])
    const {data: session} = authClient.useSession()
    const {clientSocket: socket, setClientSocket} = useSocketProvider()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(()=> {
        roomEventRef.current = roomEvents
    },[roomEvents])


    function onSend(e) {
        e.preventDefault()
        if (!socket) {
            console.warn("Socket not connected — cannot send message yet.");
            return;
        }
        const content = inputRef?.current?.value.trim();
        if(!content) return;
        inputRef.current!.value = ''

        socket.emit('msg', {room_id: ROOM_ID, msg: content})
    }

    useEffect(() => {
        if (!socket) return


        const handleConnect = () => {
            socket.emit("request-room", {room_id: ROOM_ID});
        };
        if (socket.connected) {
            handleConnect();
        }


        const handleRequestRoom: ServerToClientEvents['request-room'] = (ack) => {
            const {success} = ack
            if (ack?.memberStack) {
                setMemberStack(ack.memberStack)
            }
            if (success) {
                setIsConnected(true)
            } else {
                MakeNotification.alertFailed('')
            }
        }

        function handleExteriorRoomEvent(payload: { room_id: string }) {
            // if

        }


        const handleRoomEvent: ServerToClientEvents['room-event'] = (payload) => {
            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }

            if (payload.type === 'member') {
                setMemberStack(payload.memberStack)
            }
            setRoomEvents(prev => [...prev, payload])
        }

        const handleNotify: ServerToClientEvents['notify'] = (payload) => {
            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
        }

        const handleRequestSync: ServerToClientEvents['request-sync'] = (payload, callback) => {

            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
            const events = roomEventRef.current;


            let msgs = events.filter(val => val.type === 'msg')
            if (msgs.length > 10) msgs = msgs.slice(-10)

            const response = {data: msgs, socketId: payload.socketId, room_id: ROOM_ID}
            if (socket) {
                callback(response)
                console.log('request sync emitted', response)            }
        }

        const handleRespondSync: ServerToClientEvents['respond-sync'] = (payload) => {

            console.log('response sync received', payload)
            if(syncRef.current === true) return

            if (payload.room_id !== ROOM_ID) {
                return handleExteriorRoomEvent(payload)
            }
            setRoomEvents(prev => [...payload.data, ...prev])
            syncRef.current = true
        }

        function handleDisconnect() {
            setIsConnected(false)
        }


        socket.on("request-room", handleRequestRoom);
        socket.on("room-event", handleRoomEvent);
        socket.on("notify", handleNotify);
        socket.on("disconnect", handleDisconnect);
        socket.on("request-sync", handleRequestSync);
        socket.on("respond-sync", handleRespondSync);


        return () => {
            socket.off("request-room", handleRequestRoom);
            socket.off("room-event", handleRoomEvent);
            socket.off("notify", handleNotify);
            socket.off("disconnect", handleDisconnect);
            socket.off("request-sync", handleRequestSync);
            socket.off("respond-sync", handleRespondSync);
        };
    }, [session, ROOM_ID, socket]);



    const leaveChatroom = useMutation({
        mutationFn: () => ServerRequest.delete(`rooms/${room.id}/members`),
        onSuccess: () => {

            const filteredRooms = rooms.filter(val => val.id !== room.id);
            if(filteredRooms.length){
                router.push(`/rooms/${filteredRooms[0].slug}`)
            } else {
                router.push('/rooms')
            }
            setRooms(filteredRooms)

        }, onError: (error) => {
            setServerError('An Unexpected Error Occurred')
            setTimeout(() => {
                setServerError(undefined)
            }, 5000)
        }
    })






    return (
        <div className="flex flex-col flex-1 bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
                <Avatar>
                    <AvatarFallback style={{ backgroundColor: "red" }}>
                        {getAvatarLetters(room.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3>{room.name}</h3>
                    <button
                        onClick={() => setIsMembersSheetOpen(true)}
                        className="text-sm text-primary hover:underline flex items-center gap-1 group"
                    >
                        SocketStack: {4}
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setIsLeaveDialogOpen(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Leave Room</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    <ErrorMessage message={serverError} />
                </DropdownMenu>
            </div>

            {/* Leave Room Confirmation Dialog */}
            <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Leave {room.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to leave this chatroom? You will need to rejoin to see new messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => leaveChatroom.mutate()}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Leave Room
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* Members Sheet */}
            <MembersSheet
                isOpen={isMembersSheetOpen}
                onClose={() => setIsMembersSheetOpen(false)}
                members={mockMembers}
                chatRoomName={"Bob room"}
            />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {/*{mockMessages.map((message) => (*/}
                {/*    <MessageBubble key={message.id} message={message} />*/}
                {/*))}*/}
            </ScrollArea>

            {/* Input */}
            <form className="p-4 border-t border-border bg-card" onSubmit={onSend}>
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        ref={inputRef}
                    />
                    <Button type={"submit"} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}