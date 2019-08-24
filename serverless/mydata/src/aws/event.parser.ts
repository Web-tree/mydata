import {transformAndValidateSync, TransformValidationOptions} from 'class-transformer-validator';
import {ClassType} from 'class-transformer/ClassTransformer';
import {Ownable} from '../ownable';
import * as _ from 'lodash';
import {HandlerResponse} from './handlerResponse';
import {Event} from './event';

export class EventParser {

    static parseAs<T extends Ownable>(type: ClassType<T>, event: { body, requestContext }, options?: TransformValidationOptions): T {
        const body = <T>JSON.parse(event.body);
        body.userId = this.getUserId(event);
        return transformAndValidateSync(type, body, options);
    }

    static getUserId(event) {
        const userId = _.get(event, 'requestContext.authorizer.id', undefined);
        if (userId) {
            return userId;
        } else {
            throw new HandlerResponse().unauthorized();
        }
    }

    static fetchPathParam(event: Event, param: string): string {
        const parameter = _.get(event, `pathParameters.${param}`, undefined);
        if (parameter) {
            return parameter;
        } else {
            const message = `Missed path param: ${param}`;
            throw new HandlerResponse().badRequest(message);
        }
    }

    static fetchBodyParams(event: Event, params: string[]): any {
        const parsedBody = <object>JSON.parse(event.body);
        const result = {};
        params.forEach(value => {
            if (parsedBody[value]) {
                result[value] = parsedBody[value];
            } else {
                throw new HandlerResponse().badRequest(`Parameter ${value} is required.`);
            }
        });
        return result;
    }
}
