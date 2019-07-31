import {DataService} from '../data.service';
import {DynamoDB} from 'aws-sdk';
import {EventParser} from '../../aws/event.parser';
import {Data} from '../data.model';
import {RequestProcessor} from '../../request.processor';
import {validateSync} from 'class-validator';
import {HandlerResponse} from '../../aws/handlerResponse';

export let dataService = new DataService(process.env.DYNAMODB_TABLE, new DynamoDB.DocumentClient());

export function handler(event, context, callback) {
    RequestProcessor.process(async () => {
            const data = new Data();
            data.userId = EventParser.getUserId(event);
            data.name = EventParser.fetchPathParam(event, 'name');
            validateSync(data);
            await dataService.delete(data.userId, data.name);
            return new HandlerResponse().withCode(204);
        },
        callback
    );
}
