import TelegramBot from 'node-telegram-bot-api';
import { Command } from 'commander';
import fs from 'fs';

const token = '';
const chatId = '';

const bot = new TelegramBot(token, { polling: true });

const program = new Command();

program
    .command('send-message <message>')
    .description('Send a message to the Telegram bot')
    .action(async (message) => {
        try {
            await bot.sendMessage(chatId, message);
            console.log('Message sent successfully!');
        } catch (e) {
            console.error(e);
        }
        process.exit();
    });

program
    .command('send-photo <path>')
    .description('Send a photo to the Telegram bot')
    .action(async (path) => {
        try {
            const photo = fs.readFileSync(path);
            await bot.sendPhoto(chatId, photo);
            console.log('Photo sent successfully!');
        } catch (e) {
            console.error(e);
        }
        process.exit();
    });

program.parse(process.argv);
