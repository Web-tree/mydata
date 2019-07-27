import {DataService} from '../data.service';
import {DynamoDB} from 'aws-sdk';
import {EventParser} from '../../aws/event.parser';
import {Data} from '../data.model';
import {Callback, Context} from 'aws-lambda';
import {RequestProcessor} from '../../request.processor';

const dataService = new DataService(process.env.DYNAMODB_TABLE, new DynamoDB.DocumentClient());

export function handler(event: any, context: Context, callback: Callback) {
    RequestProcessor.process(() =>
            dataService.create(EventParser.parseAs(Data, event, {validator: {groups: ['create']}})),
        callback
    );
}
