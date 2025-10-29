'use client'


import {z} from 'zod';
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {authClient} from "@/lib/auth-client.ts";
import {useRouter} from "next/navigation";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {username} from "better-auth/plugins";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

export default function SignUpForm() {

    const router = useRouter();
    const [serverErr, setServerErr] = useState<undefined | string>(undefined)
    const [showPassword, setShowPassword] = useState(false);


    async function signIn(form: SignUpSchemaType) {
        const {data, error} = await authClient.signUp.email({
            email: `${form.username}@gmail.com`, // required
            name: form.username, // required
            password: form.password, // required
            username: form.username, // required
        }, {
            onError: (ctx) => {
                const {error} = ctx;
                if ("message" in error) {
                    error.public = error.message
                }
                ServerRequest.handleServerError(ctx, setServerErr)
                throw new Error()
            },
        });
    }


    const SignUpSchema = z.object({
        username: z.string().min(1).max(20),
        password: z.string().min(2, {message: "You should probably have a longer password. Like...5 characters at least?"}),
        password_confirmation: z.string()
    })
        .refine(data => data.password === data.password_confirmation, {
            message: "Passwords Do Not Match",
            path: ['password_confirmation']
        })
    type SignUpSchemaType = z.infer<typeof SignUpSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<SignUpSchemaType>({resolver: zodResolver(SignUpSchema)});

    //we should here call like API or something...
    const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
        try {
            await signIn(data);
            router.push('/rooms')
        } catch (e) {
            console.error(e)
        }
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <ErrorMessage message={serverErr}/>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Choose a username"
                    autoFocus
                    {...register('username')}
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

            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('password_confirmation')}
                />
                <ErrorMessage message={errors?.password_confirmation?.message}/>
            </div>


            <Button type="submit" className="w-full">
                Create Account
            </Button>
        </form>

    );
}