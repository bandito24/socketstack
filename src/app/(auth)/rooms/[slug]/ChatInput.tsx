'use client'
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import ChatMessages from "@/app/(auth)/rooms/[slug]/ChatMessages.tsx";

export default function ChatInput({room}: { room: Room }) {


    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 p-4 border-t border-gray-200 bg-gray-50"
        >
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition active:scale-[0.97]"
            >
                Send
            </button>
        </form>

    );

}
