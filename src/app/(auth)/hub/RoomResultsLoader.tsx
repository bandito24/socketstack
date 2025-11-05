import ServerRequest from "@/utils/serverRequest.ts";
import {Radio} from "lucide-react";
import RoomResults from "@/app/(auth)/hub/RoomResults.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

export default async function RoomResultsLoader() {

    const rooms = await ServerRequest.get('/hub')

    return (
        <ScrollArea className="flex-1">
            {rooms.length === 0 ? (
                <div className="text-center py-16">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Radio className="h-8 w-8 text-muted-foreground"/>
                    </div>
                    <h3 className="text-muted-foreground mb-2">No Rooms Found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                </div>
            ) : (
                <RoomResults rooms={rooms}/>
            )}
        </ScrollArea>

    )
}