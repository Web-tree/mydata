import {DataService} from '../data.service';
import {DynamoDB} from 'aws-sdk';
import {HandlerResponse} from '../../aws/handlerResponse';
import {EventParser} from '../../aws/event.parser';
import {Data} from '../data.model';
import {RequestProcessor} from '../../request.processor';

const dataService = new DataService(process.env.DYNAMODB_TABLE, new DynamoDB.DocumentClient());

export function handler(event, context, callback) {
    RequestProcessor.process(() => {
            const data = new Data();
            data.userId = EventParser.getUserId(event);
            data.name = EventParser.fetchPathParam(event, 'name');
            return dataService.get(data.userId, data.name)
        },
        callback
    );
}
