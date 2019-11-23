import {Event} from '../../../aws/event';
import {Callback, Context} from 'aws-lambda';
import {ListUsageHandler} from './usage.handlers';
import {UsageService} from '../../usage.service';
import {dataTable, dynamodb} from '../../../test/dynamoProvider';

const usageHandler = new ListUsageHandler(
    new UsageService(dataTable, dynamodb)
);
export const handler = (event: Event, context: Context, callback: Callback) => usageHandler.handle(event, context, callback);
