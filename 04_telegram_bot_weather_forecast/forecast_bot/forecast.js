const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');


const token = '';
const apiKey = '';

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
        getWeatherForecast(chatId, 'Lviv', interval);
    }
});


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
