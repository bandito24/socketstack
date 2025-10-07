import express from "express";
import {userRouter} from "./user.ts";
import {toNodeHandler} from "better-auth/node";
import {auth} from "../auth.ts";
import {authenticate} from "../middleware/auth.ts";
import {roomRouter} from "./rooms.ts";


export const apiRouter = express.Router();


apiRouter.use('/', authenticate)

apiRouter.get("/", (req, res) => {
    res.status(200).json(req?.user);
});
apiRouter.use("/users", userRouter)

apiRouter.use("/rooms", roomRouter)

apiRouter.use("/auth/{*any}", toNodeHandler(auth))

apiRouter.all(/(.*)/, (req, res) => {
    res.status(404).json({message: "Invalid Endpoint"})
});


// router.use("/plants", plantsRouter);
// router.use("/users", usersRouter);

