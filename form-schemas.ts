import {z} from "zod";

export const RoomSchema = z.object({
    name: z.string().min(1,  {message: 'Chat room is required'}).max(155, {message: 'This Room Name is too Long'}).transform(val => val.trim()),
    password: z.string().nullable().optional(),
});