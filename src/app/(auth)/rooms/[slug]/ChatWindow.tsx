'use client'
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ArrowLeft, ChevronRight, LogOut, MoreVertical, Send} from "lucide-react";
import {MembersSheet} from "@/app/(auth)/rooms/[slug]/MembersSheet.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";
import {useParams, usePathname, useRouter} from "next/navigation";
import {cn, getAvatarLetters} from "@/lib/utils.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {MessageIOEvent, RoomEvent, ServerToClientEvents} from "@mytypes/IOTypes.ts";
import {authClient} from "@/lib/auth-client.ts";
import useSocketProvider from "@/contexts/SocketProvider.tsx";
import MakeNotification from "@/utils/MakeNotification.ts";
import ChatEventIndication from "@/app/(auth)/rooms/[slug]/ChatEventIndication.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {ScrollAreaViewport} from "@radix-ui/react-scroll-area";
import {toast, Toaster} from "sonner";
import {BaseClockProvider} from "@/contexts/BaseClockProvider.tsx";
import Link from "next/link";


export function ChatWindow({room}: { room: Room }) {
    const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
    const [serverError, setServerError] = useState<undefined | string>(undefined)
    const router = useRouter();
    const queryClient = useQueryClient();


    const [isConnected, setIsConnected] = useState(false);
    const [roomEvents, setRoomEvents] = useState<MessageIOEvent[]>([])
    const [memberStack, setMemberStack] = useState<string[]>([])
    const syncRef = useRef<boolean>(false)
    const ROOM_ID = room.id.toString()
    const roomEventRef = useRef<MessageIOEvent[]>([])
    const {data: session} = authClient.useSession()
    const {clientSocket: socket, setClientSocket} = useSocketProvider()
    const inputRef = useRef<HTMLInputElement>(null)
    const scrollMessagesRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    useEffect(() => {
        roomEventRef.current = roomEvents
    }, [roomEvents])

    useLayoutEffect(() => {
        if (!scrollMessagesRef.current) return;

        const el = scrollMessagesRef.current;
        const lastMsg = el.lastElementChild;
        lastMsg?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [roomEvents]);


    function onSend(e) {
        e.preventDefault()
        if (!socket) {
            console.warn("Socket not connected — cannot send message yet.");
            return;
        }
        const content = inputRef?.current?.value.trim();
        if (!content) return;
        inputRef.current!.value = ''

        socket.emit('msg', {room_id: ROOM_ID, msg: content})
    }

    const showUserNotification = (action: "join" | "leave", username: string) => {
        const message = action === "join"
            ? `${username} joined the room`
            : `${username} left the room`;

        toast(message, {
            duration: 2000,
            position: "top-center",
        });
    };

    const registerRef = useRef(false)

    useEffect(() => {
        if (!socket) return


        const handleConnect = () => {
            socket.emit("request-room", {room_id: ROOM_ID});
        };
        if (socket.connected && !registerRef.current) {
            handleConnect();
            registerRef.current = true
        }

        const handleRequestRoom: ServerToClientEvents['request-room'] = (ack) => {
            const {success} = ack
            if (ack?.memberStack) {
                setMemberStack(ack.memberStack)
            }
            success ? setIsConnected(true) : MakeNotification.alertFailed('')

        }

        const handleMessageEvent: ServerToClientEvents['msg-event'] = (payload) => {
            setRoomEvents(prev => [...prev, payload])
        }
        const handleMemberEvent: ServerToClientEvents['member-event'] = (payload) => {
            setMemberStack(payload.memberStack)
            if (payload.username !== session?.user.username) {
                showUserNotification(payload.status, payload.username)
            }
        }


        const handleRequestSync: ServerToClientEvents['request-sync'] = (payload, callback) => {
            let msgs = roomEventRef.current;

            if (msgs.length > 10) msgs = msgs.slice(-10)

            const response = {data: msgs, socketId: payload.socketId, room_id: ROOM_ID}
            if (socket) {
                callback(response)
            }
        }

        const handleRespondSync: ServerToClientEvents['respond-sync'] = (payload) => {
            if (syncRef.current) return


            setRoomEvents(prev => [...payload.data, ...prev])
            syncRef.current = true
        }

        function handleDisconnect() {
            setIsConnected(false)
        }

        const handleRequestRoomWrapper = (ack: any) => {
            if (ack.room_id === ROOM_ID) handleRequestRoom(ack);
        };

        const handleMessageEventWrapper = (payload: any) => {
            if (payload.room_id === ROOM_ID) handleMessageEvent(payload);
        };

        const handleMemberEventWrapper = (payload: any) => {
            if (payload.room_id === ROOM_ID) handleMemberEvent(payload);
        };

        const handleRequestSyncWrapper = (payload: any, callback: any) => {
            if (payload.room_id === ROOM_ID) handleRequestSync(payload, callback);
        };

        const handleRespondSyncWrapper = (payload: any) => {
            if (payload.room_id === ROOM_ID) handleRespondSync(payload);
        };

        // register
        socket.on("request-room", handleRequestRoomWrapper);
        socket.on("msg-event", handleMessageEventWrapper);
        socket.on("member-event", handleMemberEventWrapper);
        socket.on("disconnect", handleDisconnect);
        socket.on("request-sync", handleRequestSyncWrapper);
        socket.on("respond-sync", handleRespondSyncWrapper);

        return () => {
            socket.off("request-room", handleRequestRoomWrapper);
            socket.off("msg-event", handleMessageEventWrapper);
            socket.off("member-event", handleMemberEventWrapper);
            socket.off("disconnect", handleDisconnect);
            socket.off("request-sync", handleRequestSyncWrapper);
            socket.off("respond-sync", handleRespondSyncWrapper);
        };

    }, [session, ROOM_ID, socket]);


    const leaveChatroom = useMutation({
        mutationFn: () => ServerRequest.delete(`rooms/${room.slug}/room_users`),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['rooms']})
            router.push('/rooms')
        }, onError: (error) => {
            setServerError('An Unexpected Error Occurred')
            setTimeout(() => {
                setServerError(undefined)
            }, 5000)
        }
    })


    const isRoomsNavigation = pathname.endsWith('rooms')



    return (
        <div className={cn('w-full md:flex flex-col flex-1 bg-background', isRoomsNavigation ? 'hidden' : 'flex')}>
            <Toaster/>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">

                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0"
                >
                    <Link href={'/rooms'}>
                    <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <Avatar>
                    <AvatarFallback style={{backgroundColor: room.avatar_color}}>
                        {getAvatarLetters(room.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3>{room.name}</h3>
                    <button
                        onClick={() => setIsMembersSheetOpen(true)}
                        className="text-sm text-primary hover:underline flex items-center gap-1 group"
                    >
                        SocketStack: {memberStack.length}
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform"/>
                    </button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setIsLeaveDialogOpen(true)}
                        >
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Leave Room</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    <ErrorMessage message={serverError}/>
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
                memberStack={memberStack}
                room={room}
            />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-scroll">
                <BaseClockProvider>
                    <ScrollAreaViewport ref={scrollMessagesRef}>
                        {roomEvents.map((evt, index) => (
                            <ChatEventIndication username={session?.user?.username ?? ''} roomEvent={evt} key={index}/>
                        ))}
                    </ScrollAreaViewport>
                </BaseClockProvider>
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
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </form>
        </div>
    );
}