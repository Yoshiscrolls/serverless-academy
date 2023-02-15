const fs = require('fs');

let users = [];

const loadUsers = () => {
    try {
        users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    } catch (error) {
        console.error(error);
    }
};

const saveUsers = () => {
    try {
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    users,
    loadUsers,
    saveUsers,
};
