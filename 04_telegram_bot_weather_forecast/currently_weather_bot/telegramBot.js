const TelegramBot = require('node-telegram-bot-api');
const { loadUsers, saveUsers, users } = require('./user-controller.js');
const sendForecast = require('./weather-controller.js');

const token = '6220114344:AAHUVT-ANv1aycD9IgNZSEsXdYXhRyUdp3o';

const bot = new TelegramBot(token, {polling: true});

loadUsers();

bot.onText(/\/weather/, (msg) => {
    const chatId = msg.chat.id;
    if (users.some((user) => user.chatId === chatId)) {
        bot.sendMessage(chatId, 'You have already subscribed to weather updates');
        return;
    }
    bot.sendMessage(
        chatId,
        'Please choose the city for which you would like to receive the weather forecast:',
        {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Lviv',
                        },
                    ],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        }
    );
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === 'Lviv') {
        bot.sendMessage(
            chatId,
            'Please choose the interval:',
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: 'Every 3 hours',
                            },
                        ],
                        [
                            {
                                text: 'Every 6 hours',
                            },
                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            }
        );
    } else if (
        msg.text === 'Every 3 hours' ||
        msg.text === 'Every 6 hours'
    ) {
        const interval = msg.text.split(' ')[1];
        users.push({
            chatId,
            city: 'Lviv',
            interval,
        });
        saveUsers();
        bot.sendMessage(chatId, `Weather forecast for Lviv will be sent every ${interval} hours`);
        sendForecast(chatId, 'Lviv', interval, bot);
    }
});

bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    const userIndex = users.findIndex((user) => user.chatId === chatId);
    if (userIndex === -1) {
        bot.sendMessage(chatId, 'You are not subscribed to weather updates');
        return;
    }
    const { city, interval } = users[userIndex];
    users.splice(userIndex, 1);
    saveUsers();
    bot.sendMessage(chatId,
        `You have unsubscribed from weather updates for ${city} with ${interval} hours interval`);
});

module.exports = bot;
