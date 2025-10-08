import {Room} from "@/contexts/RoomProvider.tsx";

export default function ChatMessages(props: {room: Room}){

    return (
        <ul
            id="message-list"
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        >
            <IncomingMessage content={"Hey there 👋"}/>
            <OutgoingMessage content={"Fuck You"}/>

            <li className="flex justify-end w-full">
                <p className="text-sm max-w-[75%]  bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">Hey!
                    How’s it going?</p>
            </li>


        </ul>

    )
}

function IncomingMessage({content}: { content: string }) {
    return (
        <li className="self-start max-w-[75%] bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
            <p className="text-gray-800 text-sm"> {content}</p>
        </li>
    )

}

function OutgoingMessage({content}: { content: string }) {
    return (
        <li className="flex justify-end w-full">
            <p className="text-sm max-w-[75%]  bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">Hey!
                {content}</p>
        </li>
    )

}
