import {handler} from './add'
import {Data} from '../../data.model';
import {DataService} from '../../data.service';
import {dynamodb} from '../../../test/dynamoProvider';
import {Event} from '../../../aws/event';

describe('Add handler', () => {
    let dataService: DataService;
    let data: Data;
    beforeEach(async () => {
        data = {
            name: 'a-name',
            value: 'aValue',
            type: 'other',
            userId: '123'
        };
        dataService = new DataService('data', dynamodb);
        await dataService.create(data);
    });
    afterEach(async () => {
        await dataService.delete(data.userId, data.name);
    });

    it('should return 400 response when name contains incorrect symbols', done => {
        const event: Event = {
            body: JSON.stringify({
                userId: data.userId,
                usageType: 'url',
                usageValue: 'https://google.com'
            }),
            pathParameters: {
                dataName: data.name
            },
            requestContext: {
                authorizer: {
                    id: data.userId
                }
            }
        };

        const callback = async (e, response) => {
            expect(response.statusCode).toEqual(200);
            const updatedData = await dataService.get(data.userId, data.name);
            expect(updatedData.usage).toBeTruthy();
            expect(updatedData.usage.url).toContainEqual('https://google.com');
            done();
        };

        expect.hasAssertions();
        handler(event, undefined, callback);
    });
});
