import {dynamodb} from '../test/dynamoProvider';
import {UsageService} from './usage.service';
import uuid = require('uuid');
import {Data} from './data.model';
import {DataService} from './data.service';
import {Usage} from './usage.model';


describe('Usage service', () => {
    let usageService: UsageService;
    let dataService: DataService;

    beforeEach(() => {
        usageService = new UsageService('data', dynamodb);
        dataService = new DataService('data', dynamodb)
    });

    it('should get save usage in dynamo', async () => {
        const data: Data = {
            userId: uuid(),
            name: 'a-name',
            value: 'a value',
            usage: new Usage()
        };
        await dataService.create(data);

        const type = 'url';
        const dataProcessor = 'https://google.com';
        await usageService.add(data.userId, data.name, type, dataProcessor);

        expect.assertions(2);
        return dataService.get(data.userId, data.name).then(value => {
            expect(value.usage).toBeTruthy();
            expect(value.usage.url).toContain(dataProcessor);
        });
    });

    it('should be able to add data without usage column', async () => {
        const data: Data = {
            userId: uuid(),
            name: 'a-name',
            value: 'a value',
        };
        await dataService.create(data);

        const type = 'url';
        const dataProcessor = 'https://google.com';
        await usageService.add(data.userId, data.name, type, dataProcessor);

        expect.assertions(2);
        return dataService.get(data.userId, data.name).then(value => {
            expect(value.usage).toBeTruthy();
            expect(value.usage.url).toContain(dataProcessor);
        });
    });
});
