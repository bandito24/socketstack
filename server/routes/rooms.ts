import express from "express";
import * as db from "../db.ts"
import {slugify} from "../utils/helper-functions.ts";
import {Err} from "../ErrorResponse.ts";
import {requireAuth} from "../middleware/auth.ts";
import {z} from "zod";
import {checkRoomExistence} from "#root/server/middleware/middleware.ts";
import {hashMyPassword, verifyMyPassword} from "#root/server/utils/brcrypt.ts";
import {dbPool} from "../db.ts";
import getRandomAvatarColor from "#root/server/utils/avatar-colors.ts";


export const roomRouter = express.Router()

roomRouter.use(requireAuth);


roomRouter.post('/members', checkRoomExistence, async (req, res) => {
    const {password} = req.body as { name: string, password: string | null, slug: string };
    const {user} = req;
    if (!req?.room) {
        return res.status(404).json(Err.generate('We could not find a room matching this name'))
    }
    const {room} = req;
    if (room?.password) {
        if(!password){
            return res.status(422).json({status: 'Incomplete. Password needed'})
        } else {
            const hashMatch = await verifyMyPassword(password, room?.password)
            if(!hashMatch){
                return res.status(401).json({password: 'Incorrect Credentials'})
            }
        }
    }
    const sql2 = 'INSERT INTO room_users (user_id, room_id) VALUES ($1::text, $2)'
    await db.query(sql2, [user?.id, room.id])

    return res.json({status: 'approved'})


})

roomRouter.delete(`/:id/members`, async(req, res) => {
    const {params, user} = req
    if(user){
        await dbPool.query('DELETE FROM room_users WHERE user_id = $1 AND room_id = $2', [user.id, params.id])
    }
    return res.status(204).send()
})

roomRouter.post('/', checkRoomExistence, async (req, res) => {
    const {name, password, slug} = req.body as { name: string, password: string | null, slug: string };
    const {user} = req;

    if (req?.room) {
        return res.status(409).json(Err.generate('This name is taken. Please choose another name'))
    }


    const avatarColor = getRandomAvatarColor();
    const sql1 = 'INSERT INTO rooms (name, slug, password, avatar_color) VALUES ($1, $2, $3, $4) RETURNING *';
    let hashPassword;
    if(password){
        hashPassword = await hashMyPassword(password)
    } else {
        hashPassword = password;
    }


    const qRes = await db.query(sql1, [name, slug, hashPassword, avatarColor]);


    const sql2 = 'INSERT INTO room_users (user_id, room_id) VALUES ($1::text, $2)'
    await db.query(sql2, [user?.id, qRes.rows[0].id])

    return res.status(201).json(qRes.rows[0])


})

roomRouter.get('/:slug', async (req, res) => {
    const {slug} = req.params;
    const {user} = req;

    const result = await db.query('SELECT r.id, r.name, r.slug, r.avatar_color FROM rooms r JOIN room_users ru ON ru.room_id = r.id WHERE ru.user_id = $1 AND r.slug = $2', [user?.id, slug])
    if (result.rowCount) {
        return res.status(200).json(result.rows[0])
    } else {
        return res.status(404).json([])
    }
})


roomRouter.get('/', async (req, res) => {
    const {user} = req;
    const {rows} = await db.query('SELECT r.id, r.name, r.slug, r.avatar_color FROM rooms r JOIN room_users ru ON ru.room_id = r.id WHERE ru.user_id = $1', [user?.id])
    return res.status(200).json(rows)
})


// For dev, react dev tools invalid endpoint
roomRouter.use((req, res, next) => {
    if (req.url.endsWith(".js.map")) {
        return res.status(204).end(); // No Content
    }
    next();
});







