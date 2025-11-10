'use client'
import {useRef} from "react";
import {Room} from "@/contexts/RoomProvider.tsx";

export default function ChatInput({room, onSend}: { room: Room, onSend: (msg: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null)

    function onSubmit(e){
        e.preventDefault()
        if(!inputRef || !inputRef?.current) return
        const val = inputRef.current.value.trim();
        if(!val){
            return
        }
        onSend(val)
        inputRef.current.value = ''
    }



    return (
        <form
            onSubmit={(e) => onSubmit(e)}
            className="flex items-center gap-2 p-4 border-t border-gray-200 bg-gray-50"
        >
            <input
                ref={inputRef}
                type="text"
                aria-label={"Enter your message"}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition active:scale-[0.97]"
            >
                Send
            </button>
        </form>

    );

}
