import {MessageSquare, Plus, Lock, ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {CreateChatroom} from "@/app/(auth)/rooms/CreateChatRoom.tsx";
import {JoinChatroom} from "@/app/(auth)/rooms/JoinChatRoom.tsx";

// interface Props {
//     onCreateRoom: () => void,
//     onJoinRoom: () => void
// }

export default function EmptyChatPage() {

    return (

        <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50/30">
            <div className="max-w-md w-full px-8 text-center space-y-6">
                {/* Animated graphic */}
                <div className="relative flex justify-center">
                    <div className="relative">
                        {/* Main circle */}
                        <div
                            className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                            <MessageSquare className="h-16 w-16 text-white" strokeWidth={1.5}/>
                        </div>

                        {/* Floating dots */}
                        <div
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-500 animate-pulse shadow-lg"/>
                        <div
                            className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-green-500 animate-pulse shadow-lg"
                            style={{animationDelay: "0.5s"}}/>
                        <div
                            className="absolute top-8 -left-4 w-4 h-4 rounded-full bg-yellow-500 animate-pulse shadow-lg"
                            style={{animationDelay: "1s"}}/>
                    </div>
                </div>

                {/* Text content */}
                <div className="space-y-3">
                    <h2 className="text-gray-900">No Chatroom Selected</h2>
                    <p className="text-gray-600">
                        Select a chatroom from the sidebar to start messaging, or create a new room to begin a
                        conversation.
                    </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-col gap-3 pt-4">
                    <CreateChatroom btnVariant={'main'}/>
                    <JoinChatroom btnVariant={'main'}/>
                </div>

                {/* Hint */}
                <div className="pt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <ArrowLeft className="h-4 w-4"/>
                    <span>Choose a room from the sidebar</span>
                </div>
            </div>
        </div>

    )
}