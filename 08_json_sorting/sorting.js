const https = require('https');


const endpoints = [
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-770',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-64',
];


async function fetchEndpoint(endpoint) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            https.get(endpoint, (res) => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    reject(`Request failed with status code ${statusCode}`);
                }
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const data = JSON.parse(rawData);
                        resolve(data);
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', (e) => {
                reject(`Request failed with error ${e.message}`);
            });
        });
    } catch (e) {
        console.error(`[Fail] ${endpoint}: ${e}`);
        return null;
    }
    return response;
}

async function isDoneValue(obj) {
    if (obj.isDone !== undefined) {
        return obj.isDone;
    } else {
        for (const prop in obj) {
            if (typeof obj[prop] === 'object') {
                const result = await isDoneValue(obj[prop]);
                if (result !== undefined) {
                    return result;
                }
            }
        }
    }
    return undefined;
}

async function queryEndpoints() {
    let trueCount = 0;
    let falseCount = 0;
    const responses = [];
    for (const endpoint of endpoints) {
        let response = await fetchEndpoint(endpoint);
        for (let i = 0; i < 2 && !response; i++) {
            response = await fetchEndpoint(endpoint);
        }
        if (!response) {
            continue;
        }
        const isDone = await isDoneValue(response);
        if (isDone === undefined) {
            console.error(`[Fail] ${endpoint}: The isDone key was not found`);
            continue;
        }
        console.log(`[Success] ${endpoint}: isDone - ${isDone}`);
        responses.push(isDone);
        if (isDone) {
            trueCount++;
        } else {
            falseCount++;
        }
    }
    console.log(`Found True values: ${trueCount}`);
    console.log(`Found False values: ${falseCount}`);
}

queryEndpoints();
