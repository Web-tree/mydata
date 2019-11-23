import {dynamodb} from '../test/dynamoProvider';
import {UsageService} from './usage.service';
import uuid = require('uuid');
import {Data} from './data.model';
import {DataService} from './data.service';
import {Usage, UsageList} from './usage.model';
import {HandlerResponse} from '../aws/handlerResponse';
import {deflateRawSync} from 'zlib';


describe('Usage service', () => {
    let usageService: UsageService;
    let dataService: DataService;

    beforeEach(() => {
        usageService = new UsageService('data', dynamodb);
        dataService = new DataService('data', dynamodb)
    });

    it('should get saved usage in dynamo', async (done) => {
        const usageList = new UsageList();
        const urls: Map<string, Usage> = new Map();
        urls.set('https://webtree.org', new Usage());
        usageList.url = urls;
        const data: Data = {
            userId: uuid(),
            name: 'a-name',
            value: 'a value',
            usage: usageList
        };
        await dataService.create(data);

        const type = 'url';
        const dataProcessor = 'https://google.com';
        await usageService.add(data.userId, data.name, type, dataProcessor);

        return dynamodb.get({
            TableName: 'data',
            Key: {
                userId: data.userId,
                name: data.name
            }
        }).promise().then(value => {
            console.log(value)
            expect(value.Item.usage.url).toBeTruthy();
            expect(value.Item.usage.url.dataProcessor).toBeTruthy();
            done();
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
        return dynamodb.get({
            TableName: 'data',
            Key: {
                userId: data.userId,
                name: data.name
            }
        }).promise().then(value => {
            expect(value.Item.usage).toBeTruthy();
            console.log(value.Item.usage.url[dataProcessor]);
            expect(value.Item.usage.url.dataProcessor).toBeTruthy();
        });
    });

    it('should return all usages', async (done) => {
        const data = {
            userId: uuid(),
            name: 'a-name',
            usage: { url: dynamodb.createSet(['https://a.com']) }
        };
        await dynamodb.put({
            TableName: 'data',
            Item: data
        }).promise();

        return usageService.getAll(data.userId, data.name).then(usage => {
            expect(usage.url).toEqual(['https://a.com']);
            done();
        });
    });

    it('should return empty object if there are no usage of data', async (done) => {
        const data: Data = {
            userId: uuid(),
            name: 'a-name',
        };
        await dynamodb.put({
            TableName: 'data',
            Item: data
        }).promise();

        return usageService.getAll(data.userId, data.name).then(usage => {
            expect(usage).toEqual({});
            done();
        });
    });
    it('should throw 404 when data is missed', async () => {
        try {
            await usageService.getAll('non-exists', 'non-exists');
            fail('Exception is expected');
        } catch (e) {
            expect(e).toBeInstanceOf(HandlerResponse);
            const response = e as HandlerResponse;
            expect(response.statusCode).toEqual(404);
            expect(JSON.parse(response.body)).toEqual({error: 'Data "non-exists" is not found.'})
        }
    });
});
