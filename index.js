const TelegramApi = require('node-telegram-bot-api');
const {
    gameOptions,
    Againptions
} = require('./options');

const token = '5298365239:AAE3jb6dHj93he6Mty6JqoxbmY9DY2Jpmmw';

const bot = new TelegramApi(token, {
    polling: true
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отдагывай!`, gameOptions);
};

const start = () => {

    bot.setMyCommands([{
            command: '/start',
            description: 'Начальное приветствие'
        },
        {
            command: '/info',
            description: 'Получить информацию о пользователе'
        },
        {
            command: '/game',
            description: 'Угадай цифру!'
        },
        {
            command: '/weather',
            description: 'Узнай погоду в своем городе!'
        },
        
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;


        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b77/d3a/b77d3ac0-55ee-4fcd-a869-573fef982a9c/7.jpg');
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот лучшего программиста!`);
            
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${firstName}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю!');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, Againptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал.  Бот загадал цифру -  ${chats[chatId]} `, Againptions);
        }


    });

};

start();