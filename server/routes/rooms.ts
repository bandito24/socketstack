import express from "express";
import * as db from "../db.ts"
import {slugify} from "../utils/helper-functions.ts";
import {Err} from "../ErrorResponse.ts";
import {requireAuth} from "../middleware/auth.ts";
import {NewRoomSchema} from "#root/form-schemas.ts";

export const roomRouter = express.Router()

roomRouter.use(requireAuth);

roomRouter.post('/', async ( req, res) => {

    const {user} = req;
    const {name, password} = req.body as { name: string, password: string | null };
    const result = NewRoomSchema.safeParse({name, password})
    if (!result.success) {
        return res.status(400).send(Err.fromZod(result.error))
    }

    const slug = slugify(name);
    const {rowCount} = await db.query('SELECT 1 FROM rooms WHERE slug = $1', [slug])
    if(rowCount){
        return res.status(409).json(Err.generate('name', 'This name is taken. Please choose another name'))
    }


    const sql1 = 'INSERT INTO rooms (name, slug, password) VALUES ($1, $2, $3) RETURNING *';


    const qRes = await db.query(sql1, [name, slug, password]);



    const sql2 = 'INSERT INTO room_users (user_id, room_id) VALUES ($1::text, $2)'
    await db.query(sql2, [user?.id, qRes.rows[0].id])

    return res.status(201).json(qRes.rows[0])


})

roomRouter.get('/:slug', async(req, res) => {
    const {slug} = req.params;
    const {user} = req;

    const result = await db.query('SELECT r.id, r.name, r.slug FROM rooms r JOIN room_users ru ON ru.room_id = r.id WHERE ru.user_id = $1 AND r.slug = $2', [user?.id, slug])
    if(result.rowCount){
        return res.status(200).json(result.rows[0])
    } else {
        return res.status(404).json([])
    }
})



roomRouter.get('/', async(req, res) => {
    const {user} = req;
    const {rows} = await db.query('SELECT r.id, r.name, r.slug FROM rooms r JOIN room_users ru ON ru.room_id = r.id WHERE ru.user_id = $1', [user?.id])
    return res.status(200).json(rows)
})





