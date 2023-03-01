const axios = require('axios');

const API_KEY = '53943a17d1131741a3f58a96b04b5af6';


const sendForecast = async (chatId, city, interval, bot) => {
    try {
        const { data } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=${city}`
        );
        const weather = data.weather[0];
        const temperature = data.main.temp;
        const message = `Weather forecast for ${city}: ${weather.description}, temperature: ${temperature}°C`;
        bot.sendMessage(chatId, message);
        setTimeout(
            () => sendForecast(chatId, city, interval, bot),
            interval * 60 * 60 * 1000
        );
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Failed to retrieve weather data');
    }
};

module.exports = sendForecast;
