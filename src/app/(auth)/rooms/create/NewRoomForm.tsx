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
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import MakeNotification from "@/utils/MakeNotification.ts";

export default function NewRoomForm() {
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const queryClient = useQueryClient()
    const {setRooms} = useRoomContext();


    type SchemaType = z.infer<typeof NewRoomSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<SchemaType>({resolver: zodResolver(NewRoomSchema)});

    const mutation = useMutation({
        mutationFn: (data: SchemaType) => ServerRequest.post('/rooms', data),
        onSuccess: (data: Room) => {
            debugger
            queryClient.invalidateQueries({queryKey: ['rooms']})
            setRooms(prev => [...prev, data])
        },
        onError: (data) => {
            MakeNotification.alertFailed('You failed')
        }
    })

    //we should here call like API or something...
    const onSubmit: SubmitHandler<SchemaType> = async (data) => {
        // console.log(data)
        try {
            await mutation.mutateAsync(data)
        } catch (e) {
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 bg-black/20 rounded-2xl p-10 max-w-md mx-auto w-full shadow-lg backdrop-blur-sm border border-black/30"
            >
                <h2 className="text-2xl font-semibold text-center mb-2">Create a Room</h2>

                {/* Room Name */}
                <div>
                    <Input
                        className="w-full border-2 border-black/40 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition"
                        placeholder="Room Name"
                        {...register("name")}
                    />
                    <ErrorMessage message={errors?.name?.message}/>
                </div>

                {/* Make Private Toggle */}
                <div
                    className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-2 border border-black/20">
                    <Label className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Input
                            type="checkbox"
                            onClick={handleTogglePassword}
                            className="h-4 w-4 accent-blue-500"
                        />
                        Make Private
                    </Label>
                </div>

                {/* Password Field */}
                <div>
                    <Input
                        disabled={!passwordEnabled}
                        type="password"
                        className={`w-full border-2 rounded-lg px-4 py-2 transition ${
                            passwordEnabled
                                ? "border-black/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                                : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        placeholder="Password"
                        {...register("password")}
                    />
                    <ErrorMessage message={errors?.password?.message}/>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full mt-4 py-2 rounded-xl font-semibold border-2 border-black bg-blue-100 hover:bg-blue-200 transition active:scale-[0.98]"
                >
                    Submit
                </Button>
            </form>

        </>

    )
}