import {ZodError} from "zod";

export class Err{
    static generate(source: string, message = 'An Error Occurred', status = 400){
        return {[source]: message, status: status}
    }
    static fromZod(error: ZodError){
        const issue = error.issues[0];
        const source = issue.path[0] as string
        const message = issue.message
        return Err.generate(source, message, 400);

    }
}