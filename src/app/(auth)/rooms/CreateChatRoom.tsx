'use client'
import {Plus} from "lucide-react";
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
import {Switch} from "@/components/ui/switch.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ErrorMessage} from "@/app/components/snippets.tsx";
import {CreateRoomSchema, CreateRoomSchemaType} from "#root/form-schemas.ts";
import useRoomForm from "@/hooks/useRoomForm.ts";
import {cn} from "@/lib/utils.ts";


export type JoinCreateRoomProps = {
    btnVariant: 'main' | 'sidebar'
}

export function CreateChatroom({btnVariant}: JoinCreateRoomProps) {

    const form = useForm<CreateRoomSchemaType>({resolver: zodResolver(CreateRoomSchema),  defaultValues: {
            name: "",
            password: "",
        }});

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = form


    const hk = useRoomForm<typeof CreateRoomSchema>('/rooms', form)


    return (
        <Dialog open={hk.open} onOpenChange={hk.setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={cn("w-full",
                    btnVariant === 'main' && 'text-md text-white font-bold gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
                    btnVariant === 'sidebar' && ''
                    )}>
                    <Plus className="h-4 w-4"/>
                    Create Room
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Chatroom</DialogTitle>
                    <DialogDescription>
                        Create a new chatroom. You can optionally add a password to make it private.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4" onSubmit={handleSubmit(hk.onSubmit)} autoComplete="off">
                    <ErrorMessage message={hk.serverErr}/>
                    <div className="space-y-2">
                        <Label htmlFor="room-name">Room Name</Label>
                        <Input
                            autoComplete="off"
                            id="name"
                            placeholder="Enter room name"
                            {...register("name")}
                        />
                        <ErrorMessage message={errors?.name?.message}/>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="password-toggle">Password Protection</Label>
                            <p className="text-sm text-muted-foreground">
                                Require a password to join this room
                            </p>
                        </div>
                        <Switch
                            id="password-toggle"
                            checked={hk.passwordEnabled}
                            onCheckedChange={(val) => hk.handleTogglePassword(val, CreateRoomSchema)}
                        />
                    </div>

                    {hk.passwordEnabled && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    autoComplete="off"
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    {...register("password")}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    autoComplete="off"
                                    id="confirm_password"
                                    type="password"
                                    {...register("confirm_password")}
                                    placeholder="Confirm password"
                                />
                                <ErrorMessage message={errors?.confirm_password?.message}/>
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button variant="outline" type={'button'} onClick={hk.resetFormAndHide}>
                            Cancel
                        </Button>
                        <Button type={"submit"}>Create Room</Button>
                    </DialogFooter>

                </form>

            </DialogContent>
        </Dialog>
    );
}
