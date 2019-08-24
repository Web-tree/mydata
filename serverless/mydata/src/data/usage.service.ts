import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {Data} from './data.model';
import {Usage} from './usage.model';

export class UsageService {
    private pathNotExistsMessage = 'The document path provided in the update expression is invalid for update';

    constructor(private tableName: string, private dynamodb: DocumentClient) {
    }

    add(userId: string, dataName: string, type: string, dataProcessor: string): Promise<Data> {
        return this.updateUsage(userId, dataName, type, dataProcessor)
            .catch(async reason => {
                if (reason.code === 'ValidationException' && reason.message === this.pathNotExistsMessage) {
                    await this.initUsageColumn(userId, dataName);
                    return this.updateUsage(userId, dataName, type, dataProcessor);
                }
            });
    }

    private updateUsage(userId: string, dataName: string, type: string, dataProcessor: string) {
        const params: DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#type': type,
                '#u': 'usage'
            },
            ExpressionAttributeValues: {
                ':data_processor': [dataProcessor],
                ':empty_list': []
            },
            UpdateExpression: 'SET #u.#type = list_append(if_not_exists(#u.#type, :empty_list), :data_processor)'
        };
        return new Promise<any>((resolve, reject) =>
            this.dynamodb
                .update(params)
                .promise()
                .then(value => resolve(value))
                .catch(reason => reject(reason))
        );
    }

    private initUsageColumn(userId: string, dataName: string) {
        const params: DocumentClient.UpdateItemInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
                name: dataName
            },
            ExpressionAttributeNames: {
                '#u': 'usage'
            },
            ExpressionAttributeValues: {
                ':empty_usage': new Usage()
            },
            UpdateExpression: 'SET #u = :empty_usage'
        };
        return this.dynamodb.update(params).promise();
    }
}
