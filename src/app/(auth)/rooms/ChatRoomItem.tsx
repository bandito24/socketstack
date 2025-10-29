'use client'
import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";
import {getAvatarLetters} from "@/lib/utils.ts";
import Link from "next/link";
import {clsx} from "clsx";
import {RoomPreview} from "@/app/(auth)/rooms/ChatRoomList.tsx";
import {useEffect} from "react";
import useTimeRefresh from "@/hooks/useTimeRefresh.ts";

export function ChatRoomItem({room, activeSlug, roomPreview, indicateRead}: {
    room: Room,
    activeSlug: string | undefined,
    roomPreview: RoomPreview
    indicateRead: () => void
}) {


    const activeRoom = room.slug === activeSlug
    const {timeLabel} = useTimeRefresh({eventTime: roomPreview.lastMessage?.time})

    useEffect(() => {
        if (activeRoom && roomPreview.unreadMessageCount) {
            indicateRead()
        }
    }, [activeSlug])
    const hasUnread = roomPreview.unreadMessageCount && !activeRoom;
    const {stackCount} = roomPreview

    return (
        <Link
            href={`/rooms/${room.slug}`}
            className={`w-full cursor-pointer p-4 flex items-start gap-3 hover:bg-accent transition-colors relative ${
                activeRoom ? "bg-accent" : ""
            }`}
        >
            {/* Unread indicator dot on the left edge */}
            {hasUnread ? (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r"/>
            ) : null}

            <div className="relative">
                <Avatar className="mt-1">
                    <AvatarFallback style={{backgroundColor: room.avatar_color}}>
                        {getAvatarLetters(room.name)}
                    </AvatarFallback>
                </Avatar>
                {/* Small dot badge on avatar */}
                {hasUnread ?
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card"/>
                    : null}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`truncate ${hasUnread ? "font-semibold text-foreground" : ""}`}>
              {room.name}
          </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                        {timeLabel}
          </span>
                </div>
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p
                        className={clsx(
                            "text-sm truncate w-4/6",
                            (!roomPreview.lastMessage || !roomPreview.stackCount) && 'invisible',
                            hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                    >
                        {roomPreview.lastMessage?.content ?? ''}
                    </p>
                    {hasUnread ? (
                        <Badge className="shrink-0 p-1 min-w-10 bg-primary text-primary-foreground">
                            {roomPreview.unreadMessageCount}
                        </Badge>
                    ) : null}
                </div>
                <p className={clsx("text-xs text-muted-foreground", !stackCount && 'invisible')}>
                    SocketStack: {stackCount}
                </p>
            </div>
        </Link>
    );
}