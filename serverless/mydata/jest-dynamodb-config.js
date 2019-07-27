// module.exports = require('./offline/migrations/data');
module.exports = {
    tables: [
        {
            TableName: `data`,
            KeySchema: [
                {AttributeName: 'userId', KeyType: 'HASH'},
                {AttributeName: 'name', KeyType: 'RANGE'},

            ],
            AttributeDefinitions: [
                {AttributeName: 'userId', AttributeType: 'S'},
                {AttributeName: 'name', AttributeType: 'S'}
            ],
            ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
        },
        // etc
    ],
};
