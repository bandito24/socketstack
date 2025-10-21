import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRoomContext, {Room} from "@/contexts/RoomProvider.tsx";
import ServerRequest from "@/utils/serverRequest.ts";
import {z, ZodObject} from "zod";
import {CreateRoomSchema, CreateRoomSchemaType, JoinRoomSchema, JoinRoomSchemaType} from "#root/form-schemas.ts";
import {SubmitHandler, useForm, UseFormReturn} from "react-hook-form";

type RoomSchemas = typeof CreateRoomSchema | typeof JoinRoomSchema;
export default function useRoomForm<T extends RoomSchemas>(
    postEndpoint: '/rooms' | '/rooms/room_users',
    form: UseFormReturn<JoinRoomSchemaType | CreateRoomSchemaType>,
    successFn?: () => void
) {
    const [open, setOpen] = useState(false)
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const queryClient = useQueryClient()
    const {setRooms} = useRoomContext();
    const [serverErr, setServerErr] = useState<undefined | string>(undefined)


    type SchemaData = z.infer<T>;


    const mutation = useMutation({
        mutationFn: (data: SchemaData) => ServerRequest.post(postEndpoint, data),
        onSuccess: async (data: Room) => {
            await queryClient.invalidateQueries({queryKey: ['rooms']})
            setRooms(prev => [...prev, data])
            if (successFn) {
                successFn()
            }
            setOpen(false)
            form.reset()
        },
        onError: (data) => {
            if ("status" in data) {
                const {status} = data;
                if (status === 422) {
                    setPasswordEnabled(true)
                }else if(status === 401){
                    form.setError('password', {
                        type: 'manual',
                        message: 'This password is incorrect',
                    });
                } else if(status === 404){
                    form.setError('name', {
                        type: 'manual',
                        message: 'We could not find a room matching this name',
                    });
                } else if ("public" in data) {
                    setServerErr(data.public as string)
                } else {
                    setServerErr('An unexpected error occurred. Please try again soon.')
                }
            } else {
                setServerErr('An unexpected error occurred. Please try again soon.')
            }




        }
    })

    function resetFormAndHide() {
        setServerErr(undefined)
        setOpen(false);
        form.reset()
        setPasswordEnabled(false)
    }

    const onSubmit: SubmitHandler<SchemaData> = async (data) => {
        // console.log(data)
        setServerErr(undefined)
        try {
            await mutation.mutateAsync(data)
        } catch (e) {
            console.error(e)

        }
    }

    function handleTogglePassword(enable: boolean, schema: ZodObject) {
        if (!enable) {
            form.setValue('password', '')
            if ('confirm_password' in schema.shape) {
                form.setValue('confirm_password', '')
            }
        }
        setPasswordEnabled(enable)

    }

    return {
        onSubmit,
        mutation,
        open,
        setOpen,
        passwordEnabled,
        setPasswordEnabled,
        serverErr,
        setServerErr,
        handleTogglePassword,
        resetFormAndHide
    };


}