import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Room} from "@/contexts/RoomProvider.tsx";

export function ChatRoomItem({room}: {room: Room}) {
    function getAvatarLetters(name: string): string {
        if (!name) return "";

        // Split by spaces, filter out empty parts
        const words = name
            .trim()
            .split(/[^a-zA-Z0-9]+/)
            .filter(Boolean);

        // Case 1: two or more words → use first letter of each
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }

        // Case 2: one word → take first two letters
        const firstWord = words[0];
        return firstWord.substring(0, 2).toUpperCase();
    }


    const hasUnread = -1 > 0;

    return (
        <button
            className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors relative ${
                1===1 ? "bg-accent" : ""
            }`}
        >
            {/* Unread indicator dot on the left edge */}
            {hasUnread && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r" />
            )}

            <div className="relative">
                <Avatar className="mt-1">
                    <AvatarFallback style={{ backgroundColor: 'red' }}>
                        {getAvatarLetters(room.name)}
                    </AvatarFallback>
                </Avatar>
                {/* Small dot badge on avatar */}

                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`truncate ${1===1 ? "font-semibold text-foreground" : ""}`}>
              {room.name}
          </span>
                    <span className="text-muted-foreground text-xs shrink-0">
                        10/2 12:34
          </span>
                </div>
                <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm truncate ${1===1 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        This is the last message
                    </p>
                    {1===1 && (
                        <Badge className="shrink-0 bg-primary text-primary-foreground">
                            4
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    SocketStack: 4
                </p>
            </div>
        </button>
    );
}