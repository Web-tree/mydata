'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');

module.exports.handler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // validation
    if (typeof data.value !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update data.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: getUserId(event),
            name: event.pathParameters.name
        },
        ExpressionAttributeNames: {
            '#data_value': 'value',
        },
        ExpressionAttributeValues: {
            ':value': data.value,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #data_value = :value, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    dynamodb.update(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update data.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};