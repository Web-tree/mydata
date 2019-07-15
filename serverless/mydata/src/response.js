'use strict';

module.exports = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {'Access-Control-Allow-Origin': '*'},
    }
};
