const fs = require('fs');


const files = [];
for (let i = 0; i <= 19; i++) {
    const path = `./usernames/out${i}.txt`;
    const data = fs.readFileSync(path, 'utf8');
    const words = data.split(/\s+/);
    files.push({ path, words });
}


function isUsername(word) {
    return /^[\w-]+$/g.test(word);
}


function uniqueValues() {
    const usernames = new Set();
    for (const file of files) {
        for (const word of file.words) {
            if (isUsername(word)) {
                usernames.add(word);
            }
        }
    }
    return usernames.size;
}

function existInAllFiles() {
    const usernames = [];
    for (const file of files) {
        const fileUsernames = new Set();
        for (const word of file.words) {
            if (isUsername(word)) {
                fileUsernames.add(word);
            }
        }
        usernames.push(fileUsernames);
    }
    const intersection = usernames.reduce((a, b) => new Set([...a].filter(x => b.has(x))));
    return intersection.size;
}

function existInAtleastTen() {
    const counts = new Map();
    for (const file of files) {
        const fileUsernames = new Set();
        for (const word of file.words) {
            if (isUsername(word)) {
                fileUsernames.add(word);
            }
        }
        for (const username of fileUsernames) {
            counts.set(username, (counts.get(username) || 0) + 1);
        }
    }
    let count = 0;
    for (const value of counts.values()) {
        if (value >= 10) {
            count++;
        }
    }
    return count;
}

performance.mark('start');

console.log(uniqueValues());
console.log(existInAllFiles());
console.log(existInAtleastTen());

performance.mark('end');

performance.measure('perf', 'start', 'end');
const perf = performance.getEntriesByName('perf').pop().duration;
console.log(`Elapsed time: ${ Math.floor(perf) } ms`);
