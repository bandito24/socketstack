'use client';

import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {Button} from "@/components/ui/button.tsx";
import {NewRoomSchema} from "../../../../../form-schemas.ts";
export default function NewRoomForm() {
    const [passwordEnabled, setPasswordEnabled] = useState(false)


    type SchemaType = z.infer<typeof NewRoomSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<SchemaType>({resolver: zodResolver(NewRoomSchema)});

    //we should here call like API or something...
    const onSubmit: SubmitHandler<SchemaType> = async (data) => {
        // console.log(data)
        try{

            console.log('trying')
            const res = await ServerRequest.post('/rooms', data)
            console.log(res)
        } catch(e){
            console.error(e)
        }
    }

    function handleTogglePassword() {
        if (passwordEnabled) {
            setValue('password', '')
        }
        setPasswordEnabled(!passwordEnabled)

    }


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-black/20 rounded-xl p-20 m-auto w-1/2">
                <Input className="border-2 mb-2 border-black" placeholder="Room Name" {...register("name")} />
                <ErrorMessage message={errors?.name?.message}/>


                <div className="max-w-[200px]">
                    <Label className="whitespace-nowrap"> Make Private
                        <Input type={'checkbox'} onClick={handleTogglePassword}/>
                    </Label>
                </div>
                <Input
                    disabled={!passwordEnabled}
                    className="border-2 mb-2 border-black"
                    placeholder="password"
                    {...register("password")}
                />
                <ErrorMessage message={errors?.password?.message}/>


                <Button className="cursor-pointer hover:bg-blue-200 mt-2 border-2 border-black rounded-2xl p-2"
                        type="submit">submit!
                </Button>
            </form>
        </>

    )
}