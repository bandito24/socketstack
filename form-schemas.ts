import {z} from "zod";

export const JoinRoomSchema = z.object({
    name: z.string().min(1,  {message: 'Room name is required'}).max(155, {message: 'This Room Name is too Long'}).transform(val => val.trim()),
    password: z.string().nullable().optional(),

});

export type JoinRoomSchemaType = z.infer<typeof JoinRoomSchema>;


export const CreateRoomSchema = JoinRoomSchema.extend({
    confirm_password: z.string().nullable().optional(),
}).refine(
    (data) => {
        // Only validate if either password field has a value
        if (data.password || data.confirm_password) {
            return data.password === data.confirm_password;
        }
        return true; // no passwords provided → no error
    },
    {
        message: "Passwords don't match",
        path: ["confirm_password"],
    }
);

export type CreateRoomSchemaType = z.infer<typeof CreateRoomSchema>;