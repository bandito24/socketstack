'use client'
import { UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateRoomSchema, JoinRoomSchema} from "#root/form-schemas.ts";
import {z} from "zod";
import useRoomForm from "@/hooks/useRoomForm.ts";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {JoinCreateRoomProps} from "@/app/(auth)/rooms/CreateChatRoom.tsx";
import {cn} from "@/lib/utils.ts";



export function JoinChatroom({btnVariant}: JoinCreateRoomProps) {
    type SchemaType = z.infer<typeof CreateRoomSchema>;

    const form = useForm<SchemaType>({resolver: zodResolver(JoinRoomSchema), defaultValues: {
            name: "",
            password: "",
        }});
    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = form



    const hk = useRoomForm<typeof CreateRoomSchema>('/rooms/room_users', form)





    return (
        <Dialog open={hk.open} onOpenChange={hk.setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={cn('w-full',
                    btnVariant === 'main' && 'w-full gap-2',
                    btnVariant === 'sidebar' && ''
                    )}>
                    <UserPlus className="h-4 w-4" />
                    Join Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Join Chatroom</DialogTitle>
                    <DialogDescription>
                        Enter the room name to join. If the room requires a password, you&#39;ll need to provide it.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4" onSubmit={handleSubmit(hk.onSubmit)}>
                    <div className="space-y-2">
                        <ErrorMessage message={hk.serverErr}/>
                        <Label htmlFor="join-room-name">Room Name</Label>
                        <Input
                            id="join-room-name"
                            placeholder="Enter room name"
                            {...register("name")}

                        />
                        {/*{selectedRoom && (*/}
                        {/*    <p className="text-sm text-muted-foreground">*/}
                        {/*        {selectedRoom.hasPassword ? "🔒 Password protected" : "🌐 Public room"}*/}
                        {/*    </p>*/}
                        {/*)}*/}

                        <ErrorMessage message={errors?.name?.message}/>
                    </div>

                    {hk.passwordEnabled && (
                        <div className="space-y-2">
                            <Label htmlFor="join-password">Password</Label>
                            <Input
                                id="join-password"
                                type="password"
                                placeholder="Enter password"
                                {...register("password")}
                            />
                                <p className="text-sm text-muted-foreground">
                                    🔒 This is a Password protected room
                                </p>

                            <ErrorMessage message={errors?.password?.message}/>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={hk.resetFormAndHide}>
                            Cancel
                        </Button>
                        <Button type={"submit"} disabled={false}>
                            Join Room
                        </Button>
                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    );
}