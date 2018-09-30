const TelegramBot = require('node-telegram-bot-api');
const util = require('util');
const crypto = require('crypto');

console.log("NODE_ENV = ", process.env.NODE_ENV);

if(!process.env.YANDEX_TRANSLATE_TOKEN) { 
    console.error(`
        Yandex translate token is not set up
        Get it here https://translate.yandex.ru/developers/keys
        And then execute following command:
        export YANDEX_TRANSLATE_TOKEN="YOUR_TOKEN"
    `);
    process.exit();
}

if(!process.env.TELEGRAM_BOT_TOKEN) { 
    console.error(`
        Telegram bot token is not set up
        Get it from @botfather
        And then execute following command:
        export TELEGRAM_BOT_TOKEN="YOUR_TOKEN"
    `);
    process.exit();
}

let translate = require('yandex-translate')(process.env.YANDEX_TRANSLATE_TOKEN);
let yat = {
    translate: util.promisify(translate.translate),
    detect: util.promisify(translate.detect)
}

let request_options = {};

// if run locally in develop mode, use proxy to baypass roskomnadzor restrictions
if (process.env.NODE_ENV == 'dev') {
    const Agent = require('socks5-https-client/lib/Agent')
    request_options = {
        agentClass: Agent,
        agentOptions: {
            // solution https://github.com/yagop/node-telegram-bot-api/issues/562#issuecomment-382313307
            // this is Tor socks5 proxy. For it to work, you need to run Tor Browser
            socksHost: '127.0.0.1',
            socksPort: 9150
        }
    }
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true,
    request: request_options
});

let detect_lang = function (text) {
    let ru = false, en = false;
    for (let i = 0; i < text.length; i++) {
        ru = ru || (text[i].toUpperCase() >= 'А' && text[i].toUpperCase() <= 'Я');
        en = en || (text[i].toUpperCase() >= 'A' && text[i].toUpperCase() <= 'Z');
    }
    if (ru && en) return 'both';
    if (ru) return 'ru';
    if (en) return 'en';
    return 'none'
}

const my_translate = async function (text) {
    let lang = detect_lang(text);
    if (lang == 'both') return 'Весь текст должен быть на одном языке (Русский или Английский). Смешение языков не допускается';
    if (lang == 'none') return 'Не удалось определить язык. Доступен только Русский и Английский';
    to_lang = (lang == 'ru') ? 'en' : 'ru';

    let res = await yat.translate(text, { to: to_lang });
    return res.text[0]
}

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('text', async (msg) => {
    const chatId = msg.chat.id;

    bot.sendChatAction(chatId, 'typing');

    let translated = await my_translate(msg.text);

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, translated);
    // console.log(msg.chat.id, msg.from.id, `${msg.from.first_name} ${msg.from.last_name}`, msg.text, translated);
});

bot.on('message', (msg) => {
    console.log(JSON.stringify(msg));
    // bot.sendMessage(-1001374144003, `@${msg.from.username}: ${msg.text}`);
    bot.forwardMessage(-1001374144003, msg.chat.id, msg.message_id)
})

bot.on('inline_query', async (msg) => {
    console.log(JSON.stringify(msg));
    let results = [];
    if(msg.query.length<=1) return;
    if (msg.query.length > 1) {
        let translated = await my_translate(msg.query);
        let query_hash = crypto.createHash('md5').update(msg.query).digest('hex');
        let translated_hash = crypto.createHash('md5').update(translated).digest('hex');
        results = [
            {
                type: 'article',
                id: query_hash,
                title: msg.query,
                input_message_content: {
                    message_text: msg.query
                }
            },
            {
                type: 'article',
                id: translated_hash,
                title: translated,
                input_message_content: {
                    message_text: translated
                }
            }
        ]
    }
    bot.answerInlineQuery(msg.id, results);
    bot.sendMessage(-1001374144003, `${msg.from.username}: ${msg.query}`);
})