import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useRoomContext, {Room, RoomSchema} from "@/contexts/RoomProvider.tsx";
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
        onSuccess: handleFormSuccess({queryClient, setRooms, successFn, setOpen, form}),
        onError: handleFormError({form, setPasswordEnabled, setServerErr})
    })

    function resetFormAndHide() {
        setServerErr(undefined)
        setOpen(false);
        form.reset()
        setPasswordEnabled(false)
    }

    const onSubmit: SubmitHandler<SchemaData> = async (data) => {
        setServerErr(undefined)
        try {
            await mutation.mutateAsync(data)
            resetFormAndHide()
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
        resetFormAndHide,
        form
    };


}

export function handleFormSuccess({queryClient, setRooms, setOpen, form, successFn}) {
    return async (data: Room[]) => {
        try{
            RoomSchema.parse(data)
            await queryClient.invalidateQueries({queryKey: ['rooms']})
            setRooms(prev => [...prev, data])
            if (successFn && typeof successFn === 'function') {
                successFn?.()
            }
        } catch(e){
            console.error("Did not receive a valid room object in response")
        }

    }
}

export function handleFormError({
                                    form,
                                    setPasswordEnabled,
                                    setServerErr,
                                }: {
    form: UseFormReturn<CreateRoomSchemaType>;
    setPasswordEnabled: (val: boolean) => void;
    setServerErr: (msg?: string) => void;
}) {
    return (data: any) => {
        if (data && typeof data === 'object' && 'status' in data) {
            const {status} = data;
            if (status === 422) return setPasswordEnabled(true);
            if (status === 401)
                return form.setError('password', {type: 'manual', message: 'This password is incorrect'});
            if (status === 404)
                return form.setError('name', {type: 'manual', message: 'We could not find a room matching this name'});
            if ('public' in data) return setServerErr(data.public as string);
        }
        setServerErr('An unexpected error occurred. Please try again soon.');
    };
}