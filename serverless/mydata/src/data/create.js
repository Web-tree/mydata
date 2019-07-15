'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');
const response = require('../response');

module.exports.handler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.name !== 'string') {
        console.error('Validation Failed');
        callback(null, response(400, 'Couldn\'t create data.'));
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
            callback(null, response(error.statusCode || 501, 'Couldn\'t create data.'));
            return;
        }

        callback(null, response(200, params.Item));
    });
};
