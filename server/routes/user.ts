import express from "express";
import {auth} from "../auth.ts";

export const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
    const session = await auth.api.getSession({ headers: req.headers as never });
    console.log("Server-side session:", );
    res.json(session?.user);
})


