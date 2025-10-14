import {MessageIOEvent, RoomEvent} from "@mytypes/IOTypes.ts";

export default function ChatMessages({roomEvents, username: hostUsername}: { username: string, roomEvents: RoomEvent[] }) {

    return (
        <ul
            id="message-list"
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        >
            {roomEvents.map((evt, idx) => (
                <div className="contents" key={idx}>{
                evt.type === 'msg' ?
                    (evt.username === hostUsername ? <OutgoingMessage payload={evt} /> : <IncomingMessage payload={evt} /> )
                    : null
                }</div>
            ))}

            {/*<li className="flex justify-end w-full">*/}
            {/*    <p className="text-sm max-w-[75%]  bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">Hey!*/}
            {/*        How’s it going?</p>*/}
            {/*</li>*/}


        </ul>

    )
}

function IncomingMessage({payload}: { payload: MessageIOEvent }) {
    const {username, time, content} = payload;
    return (
        <li className="flex flex-col items-start w-full">
            <EventTag username={username} time={time}/>
            <p className="text-sm max-w-[75%] text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">{content}</p>
            <time className="text-xs">{time}</time>
        </li>
    )

}

function OutgoingMessage({payload}: { payload: MessageIOEvent }) {
    const {username, time, content} = payload;
    return (
        <li className="flex flex-col items-end w-full">
            <EventTag username={username} time={time}/>
            <p className="text-sm max-w-[75%]  bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm">{content}</p>
            <time className="text-xs">{time}</time>
        </li>
    )

}

function EventTag({username, time}: { username: string, time: string }) {
    return (

        <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-700">{username}</span>
            {/*<span className="text-xs text-gray-500">{time}</span>*/}
        </div>
    )
}
