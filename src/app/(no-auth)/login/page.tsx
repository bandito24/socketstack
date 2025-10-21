import {ReactNode} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import Link from "next/link";
import AuthFormWrapper from "@/app/components/AuthFormWrapper.tsx";
import SignInForm from "@/app/(no-auth)/login/SignInForm.tsx";


export default async function Login() {

    return (
        <AuthFormWrapper title={'Sign In'}
                         subtext={'Sign in to continue to your account'}
        >

            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                        Enter your username and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <SignInForm/>


                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Don&#39;t have an account? </span>
                        <Link
                            className="text-primary hover:underline" href={"/sign-up"}>
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AuthFormWrapper>
    )
}