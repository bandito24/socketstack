import {Err} from "#root/server/ErrorResponse.ts";
import {slugify} from "#root/server/utils/helper-functions.ts";
import * as db from "#root/server/db.ts";
import {JoinRoomSchema} from "#root/form-schemas.ts";
import {dbPool} from "#root/server/db.ts";

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

export const validateAndAddRoomId = async (req, res, next) => {
    const {user} = req
    const {slug} = req.params as {slug: string}

    const {rows} = await dbPool.query(
        'SELECT r.id as room_id FROM rooms r JOIN room_users ru on r.id = ru.room_id WHERE r.slug = $1 AND ru.user_id = $2 LIMIT 1',
        [slug, user.id])
    if(rows[0]){
        req.room_id = rows[0].room_id
        next()
    } else {
        return res.status(403).json({public: "You are not permitted to view this resource"})
    }

}
