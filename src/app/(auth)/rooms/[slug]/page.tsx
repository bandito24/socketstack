import {cookies} from "next/headers";
import ServerRequest from "@/utils/serverRequest.ts";
import authorizeServerRequest, {getAuthCookie} from "@/utils/sessionHeaders.tsx";
import ChatMessages from "@/app/(auth)/rooms/[slug]/ChatMessages.tsx";
import ChatInput from "@/app/(auth)/rooms/[slug]/ChatInput.tsx";
import ChatIO from "@/app/(auth)/rooms/[slug]/ChatIO.tsx";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>
}) {

    await authorizeServerRequest();
    const {slug} = await params
    const room = await ServerRequest.get(`/rooms/${slug}`)


    return (
        <div
            className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-white/60 border border-gray-200 rounded-2xl shadow-md backdrop-blur-md overflow-hidden">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{room.name}</h2>
            </div>
            <ChatIO room={room}/>
        </div>
    )
}