import {z} from "zod";

export const NewRoomSchema = z.object({
    name: z.string().min(1).max(155, {message: 'This Room Name is too Long'}).transform(val => val.trim()),
    password: z.string().nullable().transform(val => val?.trim() || null),
});
