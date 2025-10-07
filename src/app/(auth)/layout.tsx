import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";
import {auth} from "../../../server/auth.ts";
import ReactQueryProvider from "@/contexts/ReactQueryProvider.tsx";


export default async function AuthLayout({children}: { children: ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    if (!session) {
        redirect('/login')
    }

    return (
        <>

            <ReactQueryProvider>
                {children}
            </ReactQueryProvider>
        </>
    )
}