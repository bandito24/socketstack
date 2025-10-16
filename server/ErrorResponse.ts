import {ZodError} from "zod";

export class Err{
    static generate(message = 'An Error Occurred', status = 400){
        return {public: message, status: status}
    }
    static fromZod(error: ZodError){
        const issue = error.issues[0];
        // const source = issue.path[0] as string
        const message = issue.message
        return Err.generate(message, 400);

    }
    static invalidArgument(source: 'API call', message: 'Invalid arguments provided', status: 400){
        return Err.generate(message, status);
    }
}