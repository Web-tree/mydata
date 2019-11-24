import {Event} from '../../../aws/event';
import {Callback, Context} from 'aws-lambda';
import {UsageService} from '../../usage.service';
import {dataTable, dynamodb} from '../../../test/dynamoProvider';
import {AddUsageHandler} from './usage.handlers';

const usageHandler: AddUsageHandler = new AddUsageHandler(
    new UsageService(dataTable, dynamodb)
);
export const handler = (event: Event, context: Context, callback: Callback) => usageHandler.handle(event, context, callback);
