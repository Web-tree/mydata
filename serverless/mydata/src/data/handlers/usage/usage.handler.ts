import {Event} from '../../../aws/event';
import {Context} from 'aws-lambda';
import {EventParser} from '../../../aws/event.parser';
import {UsageService} from '../../usage.service';
import {AwsHandler} from '../../../aws.handler';

export class UsageHandler extends AwsHandler {
    constructor(private usageService: UsageService) {
        super();
    }

    protected handleRequest(event: Event, context: Context) {
        const userId = EventParser.getUserId(event);
        const dataName = EventParser.fetchPathParam(event, 'dataName');
        const {usageType, usageValue} = EventParser.fetchBodyParams(event, ['usageType', 'usageValue']);
        return this.usageService.add(userId, dataName, usageType, usageValue);
    }
}
