import {getAuthCookie} from "@/utils/sessionHeaders.tsx";

export default class ServerRequest {
    static apiLocation = 'http://localhost:3000/api/'

    static headers = {
        'Content-Type': 'application/json',
        Accept: "application/json",
    };


    public static async get(resource: string) {
        return ServerRequest.sendRequest(resource, 'GET', null)
    }

    public static async post(resource: string, valueToJSON: Record<any, any>) {
        return ServerRequest.sendRequest(resource, 'POST', valueToJSON)
    }
    public static async patch(resource: string, valueToJSON: Record<any, any>) {
        return ServerRequest.sendRequest(resource, 'PATCH', valueToJSON)
    }
    public static async delete(resource: string) {
        return ServerRequest.sendRequest(resource, 'DELETE', {})
    }

    public static async put(resource: string, valueToJSON: Record<any, any>) {
        return ServerRequest.sendRequest(resource, 'PUT', valueToJSON)
    }

    public static async sendRequest(url: string, method: string, valueToJSON: Record<any, any> | any[] | null) {

        if (url[0] === '/') {
            url = url.substring(1)
        }
        url = ServerRequest.apiLocation + url;


        const options: Record<string, any> = {method: method}


        options.headers = ServerRequest.headers

        if (valueToJSON) {
            options.body = JSON.stringify(valueToJSON)
        }
        const response = await fetch(url, options)

        let responseBody;
        if(response.status == 204){
            return {status: 204}
        }
        try {
            responseBody = await response.json();
            //console.log('incoming:', responseBody)
        } catch (e) {
            responseBody = null;
        }

        if (!response.ok) {
            responseBody.status = response?.status ?? 0
            throw {...responseBody};
        }

        return responseBody;
    }

    static addHeader(key: string, value: string) {
        const existing = ServerRequest.headers[key];

        if (key.toLowerCase() === 'cookie' && existing) {
            ServerRequest.headers[key] = `${existing}; ${value}`;
        } else {
            ServerRequest.headers[key] = value;
        }
    }


    static async authenticate(betterAuthCookie: string | null){

        if(betterAuthCookie){
            ServerRequest.addHeader('Cookie', betterAuthCookie)
        }

    }


}

