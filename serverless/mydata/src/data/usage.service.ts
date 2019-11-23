import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Data} from './data.model';
import {Usage, UsageList} from './usage.model';
import {HandlerResponse} from '../aws/handlerResponse';
import {DataService} from './data.service';

export class UsageService {
    private pathNotExistsMessage = 'The document path provided in the update expression is invalid for update';
    private dataService: DataService;

    constructor(private tableName: string,
                private dynamodb: DocumentClient
    ) {
        this.dataService = new DataService(tableName, dynamodb);
    }

    add(userId: string, dataName: string, type: string, dataProcessor: string): Promise<Data> {
        return this.addUsage(userId, dataName, type, dataProcessor)
            .catch(async reason => {
                if (reason.code === 'ValidationException' && reason.message === this.pathNotExistsMessage) {
                    await this.initUsageColumn(userId, dataName, type);

                    return this.addUsage(userId, dataName, type, dataProcessor).catch(error => console.error(error));
                } else {
                    throw reason;
                }
            });
    }

    private addUsage(userId: string, dataName: string, type: string, dataProcessor: string) {
        const now = new Date().getTime();
        const usage: Usage = {createdAt: now, updatedAt: now};
        const params: DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#type': type,
                '#u': 'usage',
                '#data_processor': dataProcessor
            },
            ExpressionAttributeValues: {
                ':data_processor': usage,
            },
            UpdateExpression: 'SET #u.#type.#data_processor = :data_processor'
        };
        return new Promise<any>((resolve, reject) =>
            this.dynamodb
                .update(params)
                .promise()
                .then(value => resolve(value))
                .catch(reason => reject(reason))
        );
    }

    getAll(userId: string, dataName: string): Promise<UsageList> {
        const params: DocumentClient.GetItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#u': 'usage'
            },
            ProjectionExpression: '#u'
        };

        return new Promise<any>((resolve, reject) =>
            this.dynamodb.get(params).promise()
                .then(value => {
                    if (value.Item) {
                        resolve(value.Item.usage ? value.Item.usage : {});
                    } else {
                        throw new HandlerResponse().notFound().withError(`Data "${dataName}" is not found.`);
                    }
                })
                .catch(reason => reject(reason))
        );
    }

    private async initUsageColumn(userId: string, dataName: string, type: string): Promise<any> {
        await this.createUsageIfNotExists(userId, dataName);
        await this.createTypeIfNotExists(userId, dataName, type);
    }

    private async createTypeIfNotExists(userId: string, dataName: string, type: string) {
        const paramsDataProcessor: DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#u': 'usage',
                '#type': type
            },
            ExpressionAttributeValues: {
                ':empty_usage': {}
            },
            UpdateExpression: 'SET #u.#type = :empty_usage',
            ConditionExpression: 'attribute_not_exists(#u.#type)'
        };
        await this.dynamodb.update(paramsDataProcessor).promise();
    }

    private async createUsageIfNotExists(userId: string, dataName: string) {
        const paramsUsage: DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#u': 'usage'
            },
            ExpressionAttributeValues: {
                ':empty_usage': new UsageList()
            },
            UpdateExpression: 'SET #u = :empty_usage',
            ConditionExpression: 'attribute_not_exists(#u)'
        };
        await this.dynamodb.update(paramsUsage).promise();
    }
}
