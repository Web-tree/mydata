'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');
const response = require('../response');

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: getUserId(event)
        },
    };

    dynamodb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch data.',
            });
            return;
        }

        callback(null, response(200, result.Items));
    });
};
