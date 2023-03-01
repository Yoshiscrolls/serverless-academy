const TelegramBot = require('node-telegram-bot-api');
const weather = require('./weatherOptions');

const token = '';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/forecast/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please choose the city for which you would like to receive the weather forecast:',
        {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Lviv'
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === 'Lviv') {
        bot.sendMessage(chatId, 'Please choose the interval:', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Every 3 hours'
                        }
                    ],
                    [
                        {
                            text: 'Every 6 hours'
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else if (msg.text === 'Every 3 hours' || msg.text === 'Every 6 hours') {
        let interval = 3;
        if (msg.text === 'Every 6 hours') {
            interval = 6;
        }
        weather.getForecast(chatId, 'Lviv', interval, bot);
    }
});
