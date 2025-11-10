'use client'
import {authClient} from "@/lib/auth-client.ts";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {username} from "better-auth/plugins";
import {useState} from "react";
import ServerRequest from "@/utils/serverRequest.ts";
import {Eye, EyeOff} from "lucide-react";
import MakeNotification from "@/utils/MakeNotification.ts";

export default function SignInForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState<undefined | string>(undefined)
    const [showPassword, setShowPassword] = useState(false);

    async function signIn(form: SignInSchemaType) {
        const res = await authClient.signIn.username({
            password: form.password, // required
            username: form.username, // required
        }, {
            onError: (ctx) => {
                const error = "error" in ctx ? ctx.error : ctx;
                if ("message" in error) {
                    error.public = error.message
                }
                ServerRequest.handleServerError(error, setServerError)
                console.log(error)
                throw new Error()
            },
        });
    }


    const SignInSchema = z.object({
        username: z.string().min(1).max(40),
        password: z.string().min(2).max(40),
    })

    type SignInSchemaType = z.infer<typeof SignInSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<SignInSchemaType>({resolver: zodResolver(SignInSchema)});

    //we should here call like API or something...
    const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
        try {
            await signIn(data);
            router.push('/rooms')
        } catch (e) {
            MakeNotification.alertFailed()
        }
    }

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <ErrorMessage message={serverError}/>
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        placeholder="Enter your username"
                        {...register('username')}
                        autoFocus
                    />
                    <ErrorMessage message={errors?.username?.message}/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...register("password")}
                            className="pr-10" // make room for the eye icon
                        />

                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4"/>
                            ) : (
                                <Eye className="h-4 w-4"/>
                            )}
                        </button>
                    </div>
                    <ErrorMessage message={errors?.password?.message}/>
                </div>


                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </>
    );
}