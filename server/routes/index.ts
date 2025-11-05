import express from "express";
import {userRouter} from "./user.ts";
import {toNodeHandler} from "better-auth/node";
import {auth} from "../auth.ts";
import {authenticate} from "../middleware/auth.ts";
import {roomRouter} from "./rooms.ts";
import {dbPool} from "#root/server/db.ts";


export const apiRouter = express.Router();


apiRouter.use('/', authenticate)

apiRouter.get("/", (req, res) => {
    res.status(200).json(req?.user);
});
apiRouter.use("/users", userRouter)

apiRouter.use("/rooms", roomRouter)


apiRouter.get('/hub', async (req, res) => {
    const { rows } = await dbPool.query(`
        SELECT r.id,
               r.name,
               r.slug,
               r.description,
               r.avatar_color,
               COUNT(ru.user_id) AS total_members
        FROM rooms r
                 LEFT JOIN room_users ru ON r.id = ru.room_id
        WHERE r.broadcasting = true
        GROUP BY r.id;
    `);
    return res.json(rows);

})

apiRouter.use("/auth/{*any}", toNodeHandler(auth))

apiRouter.all(/(.*)/, (req, res) => {
    res.status(404).json({message: "Invalid Endpoint"})
});


// router.use("/plants", plantsRouter);
// router.use("/users", usersRouter);

