'use strict';

const dynamodb = require('../dynamodb');
const getUserId = require('./user/getUserId');

module.exports.handler = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: getUserId(event),
            name: event.pathParameters.name
        },
    };

    dynamodb.delete(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t remove data.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200
        };
        callback(null, response);
    });
};