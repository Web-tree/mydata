import {handler} from './delete';
import {HandlerResponse} from '../../aws/handlerResponse';
import {DataService} from '../data.service';
import {dynamodb} from '../../test/dynamoMock';
import uuid = require('uuid');

describe('Create handler test', () => {
    const dataService = new DataService('data', dynamodb);
    require('./delete').dataService = dataService;

    it('should return 204 after delete', async done => {
        const data = {
            userId: uuid(),
            name: 'some-name'
        };
        await dataService.create(data);

        const event = {
            pathParameters: {
                name: data.name
            },
            requestContext: {
                authorizer: {
                    id: data.userId
                }
            }
        };
        const callback = async (e, response: HandlerResponse) => {
            expect(response.statusCode).toEqual(204);
            expect(await dataService.get(data.userId, data.name)).toBeFalsy();
            done();
        };
        handler(event, undefined, callback);
    });
});

