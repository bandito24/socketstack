'use client'
import {authClient} from "@/lib/auth-client.ts";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import { useRouter } from "next/navigation";

export default function SignInForm(){
    const router = useRouter();

    async function signIn(form: SignInSchemaType) {
        const {data, error} = await authClient.signIn.username({
            password: form.password, // required
            username: form.username, // required
        }, {
            onRequest: () => console.log("Loading..."),
            onSuccess: (ctx) => console.log('success'),
            onError: (ctx) =>{
                console.log(ctx.error)
                alert(ctx.error.message)
                throw new Error('messed up')
            } ,
        });
    }


    const SignInSchema = z.object({
        username: z.string().min(1).max(20),
        password: z.string().min(2).max(20),
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
            const res = await signIn(data);
            await router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <h1>Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-black/20 rounded-xl p-20 m-auto w-1/2">
            <input className="border-2 mb-2 border-black" placeholder="email" {...register("username")} />
            <ErrorMessage message={errors?.username?.message}/>

            <input
                className="border-2 mb-2 border-black"
                placeholder="password"
                {...register("password")}
            />
            <ErrorMessage message={errors?.password?.message}/>



            <button className="cursor-pointer hover:bg-blue-200 mt-2 border-2 border-black rounded-2xl p-2"
                    type="submit">submit!
            </button>
        </form>
            </>
    );
}