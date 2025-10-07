'use client'


import {z} from 'zod';
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {authClient} from "@/lib/auth-client.ts";
import { useRouter } from "next/navigation";

export default function SignUpForm() {

    const router = useRouter();




    async function signIn(form: SignUpSchemaType) {
        const {data, error} = await authClient.signUp.email({
            email: `${form.username}@gmail.com`, // required
            name: form.username, // required
            password: form.password, // required
            username: form.username, // required
        }, {
            onRequest: () => console.log("Loading..."),
            onSuccess: (ctx) => console.log("Success:", ctx),
            onError: (ctx) =>{
                console.log(ctx.error)

                alert(ctx.error.message)
                throw new Error('messed up')
            } ,
        });
    }


    const SignUpSchema = z.object({
        username: z.string().min(1).max(20),
        password: z.string().min(2).max(20),
        password_confirmation: z.string().min(2)
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
           // const res = await ServerRequest.post('users', data)
            try {
                const res = await signIn(data);
                await router.push('/')
            } catch (e) {
                console.error(e)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-black/20 rounded-xl p-20 m-auto w-1/2">
            <input className="border-2 mb-2 border-black" placeholder="email" {...register("username")} />
            <ErrorMessage message={errors?.username?.message}/>

            <input
                className="border-2 mb-2 border-black"
                placeholder="password"
                {...register("password")}
            />
            <ErrorMessage message={errors?.password?.message}/>
            <input
                className="border-2 mb-2 border-black"
                placeholder="confirm password"
                {...register("password_confirmation")}
            />
            <ErrorMessage message={errors?.password_confirmation?.message}/>


            <button className="cursor-pointer hover:bg-blue-200 mt-2 border-2 border-black rounded-2xl p-2"
                    type="submit">submit!
            </button>
        </form>
        </>
    );
}