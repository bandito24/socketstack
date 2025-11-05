import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, Badge, Radio, Search, Users} from "lucide-react";
import {Suspense} from "react";
import RoomResultsLoader from "@/app/(auth)/hub/RoomResultsLoader.tsx";
import HubSearchInput from "@/app/(auth)/hub/HubSearchInput.tsx";
import Link from "next/link";

export default async function RoomHubPage() {


    return (
        <div className="flex flex-col bg-background w-full">
            {/* Header */}
            <div className="border-b border-border bg-card overflow-y-scroll">
                <div className="max-w-6xl mx-auto px-6 py-6 ">
                    <div
                        className="p-4 rounded-2xl border-2 border-ring/20 bg-gradient-to-br from-ring/10 to-chart-1/10">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="shrink-0 flex md:hidden"

                            >
                                <Link href={"/rooms"}>
                                    <ArrowLeft className="h-5 w-5"/>
                                </Link>
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Radio className="h-6 w-6 text-white"/>
                                    </div>
                                    <div>
                                        <h1>Room Hub</h1>
                                        <p className="text-muted-foreground">
                                            Discover and join public chatrooms
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <HubSearchInput/>

                    </div>

                    <Suspense fallback={<LoadingRoomsFallback/>}>
                        <RoomResultsLoader/>
                    </Suspense>

                </div>
            </div>

            {/* Room Grid */}

        </div>
    )
}

function LoadingRoomsFallback() {
    return (
        <div className="text-center h-full py-16 text-muted-foreground">
            <p>Loading rooms...</p>
        </div>
    );
}