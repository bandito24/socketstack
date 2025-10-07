import { betterAuth } from "better-auth";
import {username} from "better-auth/plugins";
import {dbPool} from "./db.ts";

export const auth = betterAuth({
    database: dbPool,
    user: {
        modelName: "users"
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 3
    },
    plugins: [
        username()
    ]
})

