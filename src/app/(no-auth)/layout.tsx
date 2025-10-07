import {ReactNode} from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "../../../server/auth.ts";

export default async function NoAuthLayout({children}: {children: ReactNode}){
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if(session){
        redirect('/')
    }

    return (
        <div className="w-full mx-auto flex flex-col items-center justify-center bg-red-300">
            {children}
        </div>
    )
}