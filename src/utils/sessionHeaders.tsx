import {cookies} from 'next/headers';
import ServerRequest from "@/utils/serverRequest.ts";

export async function getAuthCookie() {
    const cookieValue = (await cookies()).get('better-auth.session_token')?.value;

    // Return headers object you can spread into fetch()
    return cookieValue
        ? `better-auth.session_token=${cookieValue}`
        : null;
}

export default async function authorizeServerRequest() {
    const authCookie = await getAuthCookie();
    if (authCookie) {
        await ServerRequest.authenticate(authCookie)
        return true
    } else {
        return false;
    }
}
