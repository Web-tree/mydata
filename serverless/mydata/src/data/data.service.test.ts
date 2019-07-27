import {DataService} from './data.service';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {Data} from './data.model';
import uuid = require('uuid');

// jest.mock('aws-sdk/clients/dynamodb');
// const {DocumentClient} = require('aws-sdk/clients/dynamodb');

const isTest = process.env.JEST_WORKER_ID;
const config = {
    convertEmptyValues: true,
    ...(isTest && {endpoint: 'localhost:8000', sslEnabled: false, region: 'local-env'})
};

const ddb = new DocumentClient(config);

const tableName = 'data';
let dataService: DataService;
let data: Data;

beforeEach(() => {
    data = {name: 'aName', value: 'aValue', updatedAt: 0, createdAt: 0, userId: 'aUserId'};

    dataService = new DataService(tableName, ddb);
});

afterEach(async () => {
    await ddb.delete({TableName: tableName, Key: {userId: data.userId, name: data.name}}).promise();
});

describe('Data service', () => {
    describe('create method', () => {

        it('should add data in dynamo', async () => {
            const timestamp = new Date().getTime();
            await dataService.create(data);
            let {Item} = await ddb.get({TableName: tableName, Key: {userId: data.userId, name: data.name}}).promise();

            expect(Item.name).toEqual(data.name);
            expect(Item.userId).toEqual(data.userId);
            expect(Item.value).toEqual(data.value);
            expect(Item.createdAt).not.toBeLessThan(timestamp);
            expect(Item.updatedAt).not.toBeLessThan(timestamp);
            expect(Item.updatedAt).toEqual(Item.createdAt);
        });
    });
    describe('update method', () => {
        it('should update data in dynamo', async () => {
            const timestamp = new Date().getTime();
            await ddb.put({TableName: tableName, Item: data}).promise();
            data.value = 'other value';
            await dataService.update(data);

            const {Item} = await ddb.get({TableName: 'data', Key: {userId: data.userId, name: data.name}}).promise();
            expect(Item.name).toEqual(data.name);
            expect(Item.userId).toEqual(data.userId);
            expect(Item.value).toEqual(data.value);
            expect(Item.createdAt).not.toBeLessThan(0);
            expect(Item.updatedAt).not.toBeLessThan(timestamp);
        });
    });
    describe('get method', () => {
        it('should return data from dynamo', async () => {
            await ddb.put({TableName: tableName, Item: data}).promise();

            expect(await dataService.get(data.userId, data.name)).toEqual(data)
        });
    });

    describe('list method', () => {
        it('should return all user data from dynamo', async () => {
            await ddb.put({TableName: tableName, Item: data}).promise();
            data.name = 'otherName';
            await ddb.put({TableName: tableName, Item: data}).promise();

            const dataList = await dataService.list(data.userId);
            expect(dataList).toHaveLength(2);
            expect(dataList[0]).not.toEqual(dataList[1]);
            expect(dataList[1]).toEqual(data);
        });

        it('should not return other users\' data', async () => {
            await ddb.put({TableName: tableName, Item: data}).promise();
            data.userId = uuid();
            await ddb.put({TableName: tableName, Item: data}).promise();

            const dataList = await dataService.list(data.userId);
            expect(dataList).toHaveLength(1);
        });
    });
});
