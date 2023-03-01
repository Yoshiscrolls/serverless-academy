const axios = require('axios');
const NodeCache = require('node-cache');



const url = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;


const cache = new NodeCache({stdTTL: 65});


const getExchangeRate = (chatId, currency, bot) => {
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

module.exports = {
    getExchangeRate
};
