import { betterAuth } from "better-auth";
import {username} from "better-auth/plugins";
import {dbPool} from "./db.ts";
import getRandomAvatarColor from "#root/server/utils/avatar-colors.ts";

export const auth = betterAuth({
    database: dbPool,
    user: {
        modelName: "users",
        additionalFields: {
            avatar_color: {
                type: 'string',
                defaultValue: getRandomAvatarColor(),
            }

        }
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 3
    },
    plugins: [
        username()
    ]
})

