import {Message} from "@mytypes/next/chat.ts";

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isOwn = message.sender === "You";

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isOwn && (
                    <span className="text-sm text-muted-foreground px-3">
            {message.sender}
          </span>
                )}
                <div
                    className={`px-4 py-2 rounded-t-2xl rounded-br-2xl ${
                        isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                    }`}
                >
                    <p>{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground px-3">
          {message.timestamp}
        </span>
            </div>
        </div>
    );
}