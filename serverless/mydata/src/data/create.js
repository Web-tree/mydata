'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');

module.exports.handler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.name !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create data.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            userId: getUserId(event),
            name: data.name,
            value: data.value,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    dynamodb.put(params, (error) => {
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t create data.',
            });
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};