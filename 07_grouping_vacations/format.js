const https = require('https');
const fs = require('fs');
const url = 'https://jsonbase.com/sls-team/vacations';

try {
    if(!fs.existsSync('vacation.json')) {
        fs.writeFileSync('vacation.json', '')
    }

    const stats = fs.statSync('vacation.json');
    if (stats.isFile() && stats.size > 0) {
        console.log('vacation.json already exists and is not empty. Exiting program.');
        process.exit();
    }
} catch (e) {
    console.error(e);
}


https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        const originalData = JSON.parse(data);
        const transformedData = {};

        originalData.forEach(vacation => {
            const userId = vacation.user._id;
            const userName = vacation.user.name;
            const startDate = vacation.startDate;
            const endDate = vacation.endDate;

            if (!transformedData[userId]) {
                transformedData[userId] = {
                    userId: userId,
                    userName: userName,
                    vacations: []
                };
            }

            transformedData[userId].vacations.push({ startDate, endDate });
        });

        const transformedDataArray = Object.values(transformedData);

        const outputData = JSON.stringify(transformedDataArray, null, 2);
        fs.appendFileSync('vacation.json', outputData);

        console.log('Transformed data has been written to vacation.json');
    });

}).on('error', (e) => {
    console.error(e);
});
