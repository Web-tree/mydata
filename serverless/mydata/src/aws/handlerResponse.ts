import {ValidationError} from 'class-validator';

export class HandlerResponse {
    statusCode: number = 200;
    body: string;
    headers = {"Access-Control-Allow-Origin": '*'};

    serverError(error: Error, message?: string) {
        console.error(error);
        this.statusCode = error.statusCode || 500;
        this.withError(message || error.message);
        return this;
    }

    badRequest(message?: string) {
        this.statusCode = 400;
        this.withError(message || 'Bad Request');
        return this;
    }

    unauthorized(message?: string) {
        this.statusCode = 401;
        this.withError(message || 'Unauthorized');
        return this;
    }

    validationErrors(errors: ValidationError[]) {
        this.statusCode = 400;
        this.withBody(errors);
        return this;
    }

    withCode(code: number): HandlerResponse {
        this.statusCode = code;
        return this;
    }

    withBody(body: object): HandlerResponse {
        this.body = JSON.stringify(body);
        return this;
    }

    withHeader(name: string, value: string): HandlerResponse {
        this.headers[name] = value;
        return this;
    }

    private withError(message: string) {
        this.withBody({error: message});
    }
}

export class Error {
    statusCode;
    message: string;
}
