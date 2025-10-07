'use server';

import SignUpForm from "@/app/(no-auth)/SignUpForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import Link from "next/link";

export default async function SignUp() {

    return (
        <>
            <SignUpForm/>
            <div className="w-full mx-auto flex justify-center">

                <Button asChild className="w-1/2">
                    <Link href={"/login"}>
                        Change
                    </Link>
                </Button>
            </div>
        </>
    )
}