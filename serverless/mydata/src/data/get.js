'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');
const response = require('../response');

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: getUserId(event),
            name: event.pathParameters.name,
        },
    };

    dynamodb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, response(error.statusCode || 501, 'Couldn\'t fetch data.'));
            return;
        }

        callback(null, response(200, result.Item));
    });
};
