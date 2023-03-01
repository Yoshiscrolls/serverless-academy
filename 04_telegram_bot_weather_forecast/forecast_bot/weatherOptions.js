const axios = require('axios');

const apiKey = '';

const buildMessage = (forecast, interval, city) => {
    let message = '';
    const filteredForecast = interval === 3 ? forecast : forecast.filter((item, index) => index % 2 === 0);
    filteredForecast.forEach((item) => {
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
    return message;
};

const getForecast = (chatId, city, interval, bot) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url)
        .then(response => {
            const forecast = response.data.list;
            const message = buildMessage(forecast, interval, city);
            bot.sendMessage(chatId, message);
        })
        .catch(error => {
            bot.sendMessage(chatId, 'Error while getting the forecast');
            console.error(error);
        });
};

module.exports = {
    getForecast
};
