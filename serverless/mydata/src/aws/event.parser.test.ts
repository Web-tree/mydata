import {EventParser} from './event.parser';
import {Data} from '../data/data.model';
import {v4 as uuid} from 'uuid';
import {Ownable} from '../ownable';
import {HandlerResponse} from './handlerResponse';

describe('Event parser', () => {
    describe('when parse body', () => {
        const eventOf = (body: Ownable) => {
            return {
                body: JSON.stringify(body),
                requestContext: {
                    authorizer: {
                        id: body.userId
                    }
                }
            };
        };

        describe('data', () => {

            let data: Data;

            beforeEach(() => {
                data = {
                    userId: uuid(),
                    name: 'name',
                    value: 'aValue',
                    type: 'other',
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
            });

            it('should be parsed from event body', () => {
                const parsed: Data = EventParser.parseAs(Data, eventOf(data), {validator: {groups: ['create']}});
                expect(parsed).toEqual(data);
            });

            describe('validation', () => {

                const validateExceptionFor = (event, fieldName, constrants) => {
                    expect.hasAssertions();
                    try {
                        EventParser.parseAs(Data, eventOf(event), {validator: {groups: ['create']}})
                    } catch (e) {
                        expect(e.length).toEqual(1);
                        expect(e[0].constraints).toEqual(constrants);
                        expect(e[0].property).toEqual(fieldName);
                        expect(e[0].target).toEqual(data);
                    }
                };

                it('should check user id as uuid', () => {
                    data.userId = 'notUuidValue';

                    validateExceptionFor(data, 'userId', {isUuid: 'userId must be an UUID'});
                });

                describe('name', () => {
                    it('should not be empty', () => {
                        data.name = '';

                        validateExceptionFor(data, 'name', {isNotEmpty: 'name should not be empty'});
                    });
                    it('should not be longer than 50 symbols', () => {
                        data.name = 'a'.repeat(51);

                        validateExceptionFor(data, 'name', {maxLength: 'name must be shorter than or equal to 50 characters'});
                    });
                    describe('contains', () => {
                        const deniedChars = ' !@#$%&*()_+}{|":?><,.=`~';
                        for (let char of deniedChars) {
                            it(`should not contain char ${char}`, () => {
                                data.name = char;
                                validateExceptionFor(data, 'name', {matches: 'Name can contain only letters, numbers and dash.'});
                            });
                        }
                    });
                });

                describe('value', () => {
                    it('should not be longer than 300 symbols', () => {
                        data.value = 'a'.repeat(301);

                        validateExceptionFor(data, 'value', {maxLength: 'value must be shorter than or equal to 300 characters'})
                    });
                });
            });
        });
    });
    describe('when fetch path params', () => {
        it('should extract existing params', () => {
            const event = {pathParameters: {param: 'value'}};
            expect(EventParser.fetchPathParam(event, 'param')).toEqual('value')
        });
        it('should throw error response when no parameter', () => {
            const event = {pathParameters: {param: 'value'}};
            expect.hasAssertions();
            try {
                EventParser.fetchPathParam(event, 'missedParam')
            } catch (e) {
                expect(e).toBeInstanceOf(HandlerResponse);
                expect(e.statusCode).toEqual(400);
                expect(JSON.parse(e.body).error).toEqual('Missed path param: missedParam');
            }
        });
    });
});
