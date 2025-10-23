import {cookies} from "next/headers";
import ServerRequest from "@/utils/serverRequest.ts";
import authorizeServerRequest, {getAuthCookie} from "@/utils/sessionHeaders.tsx";
import {ChatWindow} from "@/app/(auth)/rooms/[slug]/ChatWindow.tsx";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>
}) {

    await authorizeServerRequest();
    const {slug} = await params
    const room = await ServerRequest.get(`/rooms/${slug}`)


    return (
        <>
        <ChatWindow room={room} />
        </>
    )
}