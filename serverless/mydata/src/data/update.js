'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');
const response = require('../response');

module.exports.handler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // validation
    if (typeof data.value !== 'string') {
        console.error('Validation Failed');
        callback(null, response(400, 'Couldn\'t update data.'));
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
            callback(null, response(error.statusCode || 501, 'Couldn\'t update data.'));
            return;
        }

        callback(null, response(200, result.Attributes));
    });
};
