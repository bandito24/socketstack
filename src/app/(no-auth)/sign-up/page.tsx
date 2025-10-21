
import SignUpForm from "@/app/(no-auth)/sign-up/SignUpForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import Link from "next/link";
import AuthFormWrapper from "@/app/components/AuthFormWrapper.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import SignInForm from "@/app/(no-auth)/login/SignInForm.tsx";

export default async function SignUp() {

    return (
        <AuthFormWrapper title={'Join SocketStack'}
                         subtext={'Create your account to get started'}
        >

            <Card>
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                        Enter your details to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <SignUpForm/>


                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link
                            className="text-primary hover:underline" href={"/login"}>
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AuthFormWrapper>







    )
}