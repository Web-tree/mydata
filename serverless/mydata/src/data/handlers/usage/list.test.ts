import {handler} from './list';
import {DataService} from '../../data.service';
import {dataTable, dynamodb} from '../../../test/dynamoProvider';
import {UsageService} from '../../usage.service';
import uuid = require('uuid');
import {Event} from '../../../aws/event';
import {Callback, Context} from 'aws-lambda';

describe('List handler', () => {
    const dataService = new DataService(dataTable, dynamodb);
    const usageService = new UsageService(dataTable, dynamodb);

    it('should return usage', async (done) => {
        const data = {name: 'a-data', userId: uuid()};
        await dataService.create(data);
        await usageService.add(data.userId, data.name, 'url', 'https://google.com');
        await usageService.add(data.userId, data.name, 'url', 'https://webtree.org');

        const event: Event = {
            pathParameters: {
                name: data.name
            },
            requestContext: {
                authorizer: {
                    id: data.userId
                }
            }
        };

        handler(event, undefined, (e, response) => {
            console.log(response);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toContain('https://google.com');
            expect(response.body).toContain('https://webtree.org');
            done();
        });
    });
});
