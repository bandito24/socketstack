'use client'
import {useEffect, useRef, useState} from "react";
import {RoomSchema} from "#root/form-schemas.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ServerRequest from "@/utils/serverRequest.ts";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import MakeNotification from "@/utils/MakeNotification.ts";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {clsx} from "clsx";

export default function JoinRoom() {
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const queryClient = useQueryClient()
    const {setRooms} = useRoomContext();



    const mutation = useMutation({
        mutationFn: (data: SchemaType) => ServerRequest.post('/rooms/join', data),
        onSuccess: async (data: Room) => {
            reset()
            await queryClient.invalidateQueries({queryKey: ['rooms']})
            setRooms(prev => [...prev, data])
        },
        onError: (data) => {
            if ("status" in data && (data.status === 422 || data.status === 401)) {
                setPasswordEnabled(true)
                if (data.status === 401) {
                    setError('password', {
                        type: 'manual',
                        message: 'This password is incorrect',
                    });
                }
            } else {
                MakeNotification.alertFailed()
            }
        }
    })

    type SchemaType = z.infer<typeof RoomSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        reset,
        setError
    } = useForm<SchemaType>({resolver: zodResolver(RoomSchema)});


    const onSubmit: SubmitHandler<SchemaType> = async (data) => {
        // console.log(data)
        try {
            await mutation.mutateAsync(data)
        } catch (e) {
            console.error(e)
        }
    }



    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                What room would you like to join?
            </h2>

            <div
                className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Join a Room</h2>

                {/* Room name input */}
                <input
                    type="text"
                    placeholder="Enter room name or ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("name")}
                />
                <ErrorMessage message={errors?.name?.message}/>

                {/* Password input */}
                <div className={clsx(!passwordEnabled && 'hidden', 'w-full')}>
                    <input

                        type="password"
                        {...register("password")}
                        placeholder="This room requires a password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage message={errors?.password?.message}/>
                    {passwordEnabled ?
                        <p className="text-sm text-orange-400 font-bold">This room requires a password</p> : null}
                </div>

                {/* Join button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
                >
                    Join Room
                </button>
            </div>
        </form>
    );

}