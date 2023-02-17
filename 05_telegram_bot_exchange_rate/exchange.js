const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');

const token = '6220114344:AAHUVT-ANv1aycD9IgNZSEsXdYXhRyUdp3o';
const apiKey = '53943a17d1131741a3f58a96b04b5af6';
const url = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;

const bot = new TelegramBot(token, { polling: true });
const cache = new NodeCache({ stdTTL: 60 });

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
        getExchangeRate(chatId, msg.text);
    } else if (msg.text === 'Every 3 hours' || msg.text === 'Every 6 hours') {
        getWeatherForecast(chatId, 'Lviv', msg.text === 'Every 6 hours' ? 6 : 3);
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


const getExchangeRate = (chatId, currency) => {
    const cachedData = cache.get(currency);

    if (cachedData) {
        const message = `Exchange rate for ${currency}: ${cachedData.buy} UAH (buy) / ${cachedData.sale} UAH (sale)`;
        bot.sendMessage(chatId, message);
    } else {
        axios.get(url)
            .then(response => {
                const data = response.data.find(item => item.ccy === currency);
                if (data) {
                    cache.set(currency, data);
                    const message = `Exchange rate for ${currency}: ${data.buy} UAH (buy) / ${data.sale} UAH (sale)`;
                    bot.sendMessage(chatId, message);
                } else {
                    bot.sendMessage(chatId, `Sorry, I couldn't find the exchange rate for ${currency}.`);
                }
            })
            .catch(error => {
                bot.sendMessage(chatId, 'Error while getting the exchange rate');
                console.error(error);
            });
    }
};

const getWeatherForecast = (chatId, city, interval) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url)
        .then(response => {
            const forecast = response.data.list;
            let message = '';
            let index = 0
            if (interval === 6) {
                forecast.forEach(item => {
                    if (index % 2 === 0) {
                        const date = new Date(item.dt * 1000);
                        const dateString = date.toLocaleDateString([], {month: 'short', day: 'numeric'});
                        const timeString = date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        message += `${dateString} ${timeString}: 
                    Weather in ${city} - ${item.weather[0].description}.Temperature: ${Math.floor(item.main.temp)}°C\n`;
                    }
                    index++
                });

                bot.sendMessage(chatId, message);
            }
            if (interval === 3) {
                forecast.forEach(item => {
                    const date = new Date(item.dt * 1000);
                    const dateString = date.toLocaleDateString([], {month: 'short', day: 'numeric'});
                    const timeString = date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    message += `${dateString}. ${timeString}: 
                    Weather in ${city} - ${item.weather[0].description}.Temperature: ${Math.floor(item.main.temp)}°C\n`;
                });

                bot.sendMessage(chatId, message);
            }
        })
        .catch(error => {
            bot.sendMessage(chatId, 'Error while getting the forecast');
            console.error(error);
        });
};
