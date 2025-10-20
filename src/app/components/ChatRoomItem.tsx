import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";
import {getAvatarLetters} from "@/lib/utils.ts";
import Link from "next/link";

export function ChatRoomItem({room, activeSlug}: {room: Room, activeSlug: string | undefined}) {
    const hasUnread = room?.notification_count;
    const memberCount = 4;


    const activeRoom = room.slug === activeSlug

    return (
        <Link
            href={`/rooms/${room.slug}`}
            className={`w-full cursor-pointer p-4 flex items-start gap-3 hover:bg-accent transition-colors relative ${
                activeRoom ? "bg-accent" : ""
            }`}
        >
            {/* Unread indicator dot on the left edge */}
            {hasUnread && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r" />
            )}

            <div className="relative">
                <Avatar className="mt-1">
                    <AvatarFallback style={{ backgroundColor: room.avatar_color }}>
                        {getAvatarLetters(room.name)}
                    </AvatarFallback>
                </Avatar>
                {/* Small dot badge on avatar */}

                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`truncate ${hasUnread ? "font-semibold text-foreground" : ""}`}>
              {room.name}
          </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                        10/2 12:34
          </span>
                </div>
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm truncate ${hasUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        This is the last message
                    </p>
                    {room?.notification_count && (
                        <Badge className="shrink-0 bg-primary text-primary-foreground">
                            {room.notification_count}
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    SocketStack: {memberCount}
                </p>
            </div>
        </Link>
    );
}