import {HandlerResponse} from './aws/handlerResponse';
import {Callback} from 'aws-lambda';
import {ValidationError} from 'class-validator';

export class RequestProcessor {
    static process(request: () => Promise<any>, callback: Callback) {
        try {
            request()
                .then(response => callback(null, new HandlerResponse().withBody(response)))
                .catch(reason => this.processError(reason, callback));
        } catch (e) {
            this.processError(e, callback);
        }
    }

    private static processError(e, callback: Callback) {
        if (e instanceof HandlerResponse) {
            callback(null, e);
        } else if (e instanceof Array) {
            callback(null, new HandlerResponse().validationErrors(e))
        } else {
            console.error(e);
            callback(null, new HandlerResponse().serverError(e));
        }
    }
}
