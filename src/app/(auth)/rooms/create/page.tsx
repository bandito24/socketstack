'use server';

import NewRoomForm from "@/app/(auth)/rooms/create/NewRoomForm.tsx";

export default async function CreateRoom(){

    return (
    <div>
        <NewRoomForm />
    </div>
    )
}