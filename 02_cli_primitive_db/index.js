import inquirer from "inquirer";
import fs from "fs";

async function main() {
    let users = [];
    try {
        const data = fs.readFileSync("users.txt");
        users = JSON.parse(data.toString());
    } catch (e) {
        console.error(e);
    }
    let stopAdding = false;

    while (!stopAdding) {
        const { name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter user name or press Enter to stop adding users:",
            },
        ]);

        if (!name) {
            stopAdding = true;
            break;
        }

        const { gender } = await inquirer.prompt([
            {
                type: "list",
                name: "gender",
                message: "Choose user gender:",
                choices: ["Male", "Female"],
            },
        ]);

        const { age } = await inquirer.prompt([
            {
                type: "input",
                name: "age",
                message: "Enter user age:",
                validate: (input) => {
                    if (!isNaN(input) && input >= 0) {
                        return true;
                    }
                    return "Age must be a number and can't be less than 0.";
                },
            },
        ]);

        users.push({ name, gender, age });
    }

    fs.writeFileSync("users.txt", JSON.stringify(users));
    console.log("Users added to database successfully!");

    const { search } = await inquirer.prompt([
        {
            type: "confirm",
            name: "search",
            message: "Do you want to search for a user in the database?",
        },
    ]);

    if (search) {
        const { name } = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter the name of the user you want to search for:",
            },
        ]);

        const foundUsers = users.filter((user) => user.name.toLowerCase() === name.toLowerCase());

        if (foundUsers.length === 0) {
            console.log("No user was found with this name.");
        } else {
            console.log("Users found in the database:");
            console.log(foundUsers);
        }
    }

    console.log("All users in the database:");
    console.log(users);
}

main();
