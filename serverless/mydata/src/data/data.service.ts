import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {Data} from './data.model';
import {UUID} from 'aws-sdk/clients/inspector';
import {HandlerResponse} from '../aws/handlerResponse';

export class DataService {

    constructor(
        private tableName: string,
        private dynamoDb: DocumentClient) {
    }

    async create(data: Data): Promise<Data> {
        const timestamp = new Date().getTime();
        data.createdAt = timestamp;
        data.updatedAt = timestamp;

        const params = {
            TableName: this.tableName,
            Item: data
        };

        return new Promise((resolve, reject) => {
            this.dynamoDb
                .put(params)
                .promise()
                .then(() => resolve(params.Item))
                .catch(error => reject(error))
        });
    }

    async update(data: Data): Promise<Data> {
        const timestamp = new Date().getTime();
        const params = {
            TableName: this.tableName,
            Key: {
                userId: data.userId,
                name: data.name
            },
            ExpressionAttributeNames: {
                '#data_value': 'value',
                '#data_type': 'type',
            },
            ExpressionAttributeValues: {
                ':type': data.type,
                ':value': data.value,
                ':updatedAt': timestamp,
            },
            UpdateExpression: 'SET #data_value = :value, #data_type = :type, updatedAt = :updatedAt',
            ReturnValues: 'ALL_NEW',
        };

        return new Promise<any>((resolve, reject) =>
            this.dynamoDb.update(params)
                .promise()
                .then(result => resolve(result.Attributes))
                .catch(error => reject(error))
        );
    }

    async get(userId: string, name: string): Promise<Data> {
        const params: DocumentClient.GetItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: name
            }
        };
        return new Promise<any>((resolve, reject) =>
            this.dynamoDb
                .get(params)
                .promise()
                .then(result => {
                    if (result.Item) {
                        resolve(result.Item)
                    } else {
                        throw new HandlerResponse().notFound().withError(`Data with name ${name} not exists`)
                    }
                })
                .catch(error => reject(error))
        );
    }

    list(userId: UUID): Promise<Data[]> {
        const params: DocumentClient.QueryInput = {
            TableName: this.tableName,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };
        return new Promise<any>((resolve, reject) =>
            this.dynamoDb
                .query(params)
                .promise()
                .then(value => resolve(value.Items))
                .catch(reason => reject(reason))
        )
    }

    delete(userId: UUID, name: string): Promise<void> {
        const params: DocumentClient.DeleteItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: name
            }
        };
        return new Promise<void>((resolve, reject) =>
            this.dynamoDb.delete(params).promise()
                .then(() => resolve())
                .catch(e => reject(e))
        );
    }
}
