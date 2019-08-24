import {Event} from './aws/event';
import {Callback, Context} from 'aws-lambda';
import {RequestProcessor} from './request.processor';

export abstract class AwsHandler {
    handle(event: Event, context: Context, callback: Callback) {
        RequestProcessor.process(() => this.handleRequest(event, context), callback);
    }

    protected abstract handleRequest(event: Event, context: Context);
}
