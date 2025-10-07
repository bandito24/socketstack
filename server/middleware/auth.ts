import {auth} from "../auth.ts";
import {Err} from "../ErrorResponse.ts";

export const authenticate = async function(req, res, next){
    try{
    const session = await auth.api.getSession({ headers: req.headers as never });

    if(session) req.user = session.user
    else req.user = null;

    } catch(e){
        console.error('api auth session failed')
    }

    next()
}

export const requireAuth = (req, res, next) => {
    if(!("user" in req) || !req.user){
        res.status(401).json(Err.generate('Unauthenticated', 'Sign In', 401))
    }
    next()
}