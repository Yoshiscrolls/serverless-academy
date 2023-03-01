const TelegramBot = require('node-telegram-bot-api');
const { getWeatherForecast } = require('./weather-controller');
const { getExchangeRate } = require('./exchange-controller');


const token = '';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Choose an option:', {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: 'Forecast'
                    },
                    {
                        text: 'Exchange Rate'
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
    if (msg.text === 'Forecast') {
        bot.sendMessage(chatId, 'Please choose the city for which you would like to receive the weather forecast:',
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: 'Lviv'
                            }
                        ],
                        [
                            {
                                text: 'Previous menu'
                            }

                        ]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
    } else if (msg.text === 'Exchange Rate') {
        bot.sendMessage(chatId, 'Please choose the currency:', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'USD'
                        },
                        {
                            text: 'EUR'
                        }
                    ],
                    [
                        {
                            text: 'Previous menu'
                        }

                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else if (msg.text === 'Lviv') {
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
                    ],
                    [
                        {
                            text: 'Previous menu'
                        }

                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else if (msg.text === 'USD' || msg.text === 'EUR') {
        getExchangeRate(chatId, msg.text, bot);
    } else if (msg.text === 'Every 3 hours' || msg.text === 'Every 6 hours') {
        getWeatherForecast(chatId, 'Lviv', msg.text === 'Every 6 hours' ? 6 : 3, bot);
    } else if (msg.text === 'Previous menu') {
        bot.sendMessage(chatId, 'Choose an option:', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Forecast'
                        },
                        {
                            text: 'Exchange Rate'
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});
