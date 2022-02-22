//import  config json file here 
const data = require('../config/config.json');
const { Client } = require('pg');
const connection = function () {
    return new Client({
        user: data['user'],
        host: data['ip'],
        database: data['database'],
        password: data['password'],
    });
}

const execute = async function (query) {
    let client = connection()
    client.connect()
    let result = await client.query(query);
    client.end();
    return result.rows;



}

const executeWithParameter = async function (query, value) {
    const client = connection()
    client.connect()
    const result = await client.query(query, value);
    client.end();
    return result;


}

module.exports = { execute, executeWithParameter }