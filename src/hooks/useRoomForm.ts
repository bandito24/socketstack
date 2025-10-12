import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import MakeNotification from "@/utils/MakeNotification.ts";
import {z} from "zod";
import {RoomSchema} from "#root/form-schemas.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export default function useRoomForm(postEndpoint: string){
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const queryClient = useQueryClient()
    const {setRooms} = useRoomContext();


    const mutation = useMutation({
        mutationFn: (data: SchemaType) => ServerRequest.post('/rooms/join', data),
        onSuccess: async (data: Room) => {
            debugger
            await queryClient.invalidateQueries({queryKey: ['rooms']})
            setRooms(prev => [...prev, data])
        },
        onError: (data) => {
            MakeNotification.alertFailed('You failed')
        }
    })

    type SchemaType = z.infer<typeof RoomSchema>;

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<SchemaType>({resolver: zodResolver(RoomSchema)});

    const onSubmit: SubmitHandler<SchemaType> = async (data) => {
        // console.log(data)
        try {
            await mutation.mutateAsync(data)
        } catch (e) {
            console.error(e)
        }
    }




}