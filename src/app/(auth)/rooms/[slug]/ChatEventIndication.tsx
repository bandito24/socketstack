import {MemberEvent, MessageIOEvent, RoomEvent} from "@mytypes/IOTypes.ts";


export default function ChatEventIndication({roomEvent: evt, username: hostUsername}: {
    username: string,
    roomEvent: RoomEvent
}) {

    return (
        evt.type === 'msg' ?
            <MessageIndication username={hostUsername} roomEvent={evt as MessageIOEvent}/> :
            <LeaveJoinIndication roomEvent={evt as MemberEvent}/>
    )
}


function MessageIndication({roomEvent: evt, username: hostUsername}: { username: string, roomEvent: MessageIOEvent }) {
    const isOwn = evt.username === hostUsername

    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
            <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isOwn && (
                    <span className="text-sm text-muted-foreground px-3">
            {evt.username}
          </span>
                )}
                <div
                    className={`px-4 py-2 rounded-t-2xl ${
                        isOwn
                            ? "bg-primary text-primary-foreground rounded-bl-2xl"
                            : "bg-muted text-foreground rounded-br-2xl"
                    }`}
                >
                    <p>{evt.content}</p>
                </div>
                <span className="text-xs text-muted-foreground px-3">
          {evt.time}
        </span>
            </div>
        </div>
    );
}

function LeaveJoinIndication({roomEvent: evt}: { roomEvent: MemberEvent }) {
    const flag = evt.status === 'join' ? "Joined" : "Left";
    return (

        <div className="flex justify-center mb-4">
            <div className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                {`${evt.username} ${flag} the Stack`}
            </div>
        </div>
    );
}