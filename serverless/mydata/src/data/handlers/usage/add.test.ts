import {handler} from './add'
import {Data} from '../../data.model';
import {DataService} from '../../data.service';
import {dataTable, dynamodb} from '../../../test/dynamoProvider';
import {Event} from '../../../aws/event';
import {UsageService} from '../../usage.service';

xdescribe('Add handler', () => {
    let dataService: DataService;
    let usageService: UsageService;
    let data: Data;
    beforeEach(async () => {
        data = {
            name: 'a-name',
            value: 'aValue',
            type: 'other',
            userId: '123'
        };
        dataService = new DataService(dataTable, dynamodb);
        usageService = new UsageService(dataTable, dynamodb);
        await dataService.create(data);
    });
    afterEach(async () => {
        await dataService.delete(data.userId, data.name);
    });

    it('should call usage handler', done => {
        const event: Event = {
            body: JSON.stringify({
                usageType: 'url',
                usageValue: 'https://google.com'
            }),
            pathParameters: {
                name: data.name
            },
            requestContext: {
                authorizer: {
                    id: data.userId
                }
            }
        };

        const callback = async (e, response) => {
            expect(response.statusCode).toEqual(200);
            expect(await usageService.getAll(data.userId, data.name)).toEqual({url: ['https://google.com']});
            done();
        };

        expect.hasAssertions();
        handler(event, undefined, callback);
    });
});
