import express from "express";
import {validateAndAddRoomId} from "#root/server/middleware/middleware.ts";
import * as db from "#root/server/db.ts";
import {dbPool} from "#root/server/db.ts";
import type {RoomUsersDTO} from "#root/types/DTOs.ts";


export const roomUserRouter = express.Router({mergeParams: true})


roomUserRouter.use(validateAndAddRoomId)




roomUserRouter.get('/', async (req, res) => {
    const {room_id} = req;
    const {rows} = await db.query('SELECT username, avatar_color from users WHERE id IN (SELECT user_id FROM room_users where room_id = $1)', [room_id])
    return res.json(rows as RoomUsersDTO[])
})

roomUserRouter.delete(`/`, async (req, res) => {
    const {room_id} = req;
    const {user} = req;
    if (user) {
        await dbPool.query('DELETE FROM room_users WHERE user_id = $1 AND room_id = $2', [user.id, room_id])
    }
    return res.status(204).send()
})
