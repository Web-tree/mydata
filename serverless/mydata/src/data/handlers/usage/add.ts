import {Event} from '../../../aws/event';
import {Callback, Context} from 'aws-lambda';
import {UsageService} from '../../usage.service';
import {dynamodb} from '../../../test/dynamoProvider';
import {UsageHandler} from './usage.handler';

const usageHandler: UsageHandler = new UsageHandler(
    new UsageService(process.env.DYNAMODB_TABLE, dynamodb)
);
export const handler = (event: Event, context: Context, callback: Callback) => usageHandler.handle(event, context, callback);
