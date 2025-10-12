import {auth} from "#root/server/auth.ts";
import {headers} from "next/headers";

export async function getServerAuthSession(){
    return await auth.api.getSession({
        headers: await headers()
    })
}