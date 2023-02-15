#!/usr/bin/env node
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Enter words or numbers separated by a space: ");

readline.on('line', (input) => {
    if (input === 'exit') {
        console.log("Exiting program...");
        readline.close();
    } else {
        const data = input.split(" ").map(val => isNaN(val) ? val : parseFloat(val));
        if (data.length < 2 || data.length > 10) {
            console.log("Invalid input. Enter minimum 2 and maximum 10 values separated by a space.");
            return;
        }
        console.log(`How would you like to sort the input?
            1.Sort words alphabetically
            2.Show numbers from lesser to greater
            3.Show numbers from greater to lesser
            4.Display words in ascending order by number of letters in the word
            5.Show only unique words
            6.Display only unique values from the set of words and numbers entered by the user
            Enter choice (1-6): `);

        readline.question("Enter a number (1-6) or 'exit': ", (sortMethod) => {
            if (sortMethod === 'exit') {
                console.log("Exiting program...");
                readline.close();
            } else {
                switch (sortMethod) {
                    case "1":
                        console.log(
                            "Words sorted alphabetically: ",
                            data.filter(val => typeof val === "string").sort()
                        );
                        break;
                    case "2":
                        console.log(
                            "Numbers sorted in ascending order: ",
                            data.filter(val => typeof val === "number")
                                .sort((a, b) => a - b)
                        );
                        break;
                    case "3":
                        console.log(
                            "Numbers sorted in descending order: ",
                            data.filter(val => typeof val === "number")
                                .sort((a, b) => b - a)
                        );
                        break;
                    case "4":
                        console.log("Words sorted by length: ",
                            data.filter(val => typeof val === "string")
                                .sort((a, b) => a.length - b.length)
                        );
                        break;
                    case "5":
                        console.log("Unique words: ", [...new Set(data.filter(val => typeof val === "string"))]);
                        break;
                    case "6":
                        console.log("Unique values: ", [...new Set(data)]);
                        break;
                    default:
                        console.log("Invalid input. Try again.");
                        break;
                }
            }
        });
    }
});

