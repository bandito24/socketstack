'use server';

import {Button} from "@/components/ui/button.tsx";
import Link from "next/link";
import SignInForm from "@/app/(no-auth)/SignInForm.tsx";

export default async function Login() {

    return (
        <>
            <SignInForm/>
            <Button asChild className="w-1/2">
                <Link href={"/sign-up"}>
                    Change
                </Link>
            </Button>
        </>
    )
}