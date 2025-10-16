import {Err} from "#root/server/ErrorResponse.ts";
import {slugify} from "#root/server/utils/helper-functions.ts";
import * as db from "#root/server/db.ts";
import {JoinRoomSchema} from "#root/form-schemas.ts";

export const checkRoomExistence = async (req, res, next) => {
    const {name, password} = req.body as { name: string, password: string | null };
    const result = JoinRoomSchema.safeParse({name, password})
    if (!result.success) {
        return res.status(400).send(Err.fromZod(result.error))
    }

    const safePassword = (!password && password !== '0') ? null : password
    req.body.password = safePassword

    const slug = slugify(name);
    const {rows} = await db.query('SELECT * FROM rooms WHERE slug = $1', [slug])
    if (rows.length) {
        req.room = rows[0]
    } else {
        req.room = null
    }
    req.body.slug = slug
    next()
}
