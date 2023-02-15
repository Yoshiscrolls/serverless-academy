const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { loadUsers, saveUsers, users } = require('./user-controller.js')

const token = '';
const apiKey = '';

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
        sendForecast(chatId, 'Lviv', interval)
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
    clearInterval(intervalId);
});

let intervalId;

const sendForecast = async (chatId, city, interval) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = response.data;
        const message = `The weather in ${city}: 
        ${data.weather[0].description}
        temperature - ${Math.floor(data.main.temp)}°C.`;
        bot.sendMessage(chatId, message);

        intervalId = setInterval(() => {
            bot.sendMessage(chatId, message);
        }, interval * 60 * 60 * 1000);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Something went wrong while getting the weather forecast');
    }
};
