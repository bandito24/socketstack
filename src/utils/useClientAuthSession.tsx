import {authClient} from "@/lib/auth-client.ts";

export default function useClientAuthSession(){
    return authClient.useSession()
}