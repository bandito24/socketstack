
export default class ServerRequest {
    static apiLocation = '/api/'


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


        options.headers = {
            'Content-Type': 'application/json',
            Accept: "application/json",
        };
        if (localStorage.getItem('token')){
            options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        }
        if (valueToJSON) {
            options.body = JSON.stringify(valueToJSON)
        }
        const response = await fetch(url, options)

        let responseBody;
        try {
            responseBody = await response.json();
            console.log('incoming:', responseBody)
        } catch (e) {
            responseBody = null;
        }

        if (!response.ok) {
            responseBody.status = response?.status ?? 0
            throw {...responseBody};
        }

        return responseBody;
    }


}