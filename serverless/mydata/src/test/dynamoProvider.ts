import {DocumentClient} from 'aws-sdk/clients/dynamodb';

const isTest = process.env.JEST_WORKER_ID;
let table = isTest ? 'data' : process.env.DYNAMODB_TABLE;
const config = {
    convertEmptyValues: true,
    ...(isTest && {endpoint: 'localhost:8000', sslEnabled: false, region: 'local-env'})
};

export var dynamodb = new DocumentClient(config);
export var dataTable = table;
