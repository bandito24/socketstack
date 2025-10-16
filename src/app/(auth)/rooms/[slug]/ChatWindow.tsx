'use client'
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {ChevronRight, Send} from "lucide-react";
import {MembersSheet} from "@/app/components/MembersSheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MessageBubble} from "@/app/components/MessageBubble.tsx";
import {useState} from "react";
import {mockMembers, mockMessages} from "@mytypes/next/chat.ts";



export function ChatWindow() {
    const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);


    const handleSend = () => {
       console.log('hi')
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    return (
        <div className="flex flex-col flex-1 bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
                <Avatar>
                    <AvatarFallback style={{ backgroundColor: "red" }}>
                        {'FU'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3>{"Fuck off"}</h3>
                    <button
                        onClick={() => setIsMembersSheetOpen(true)}
                        className="text-sm text-primary hover:underline flex items-center gap-1 group"
                    >
                        SocketStack: {4}
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Members Sheet */}
            <MembersSheet
                isOpen={isMembersSheetOpen}
                onClose={() => setIsMembersSheetOpen(false)}
                members={mockMembers}
                chatRoomName={"Bob room"}
            />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {mockMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button onClick={handleSend} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}