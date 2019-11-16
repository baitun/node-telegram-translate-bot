require("dotenv").config();
import TelegramBot from "node-telegram-bot-api";
import util from "util";
import crypto from "crypto"; // I use it for generate md5 hashes
import { Options } from "request";

console.log("NODE_ENV = ", process.env.NODE_ENV);

const YANDEX_TRANSLATE_TOKEN: string = process.env.YANDEX_TRANSLATE_TOKEN || "";
const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || "";

if (!YANDEX_TRANSLATE_TOKEN) {
  console.error(`
    Yandex translate token is not set up
    Get it here https://translate.yandex.ru/developers/keys
    And then add to file .env this line:
    YANDEX_TRANSLATE_TOKEN="YOUR_TOKEN"
  `);
  process.exit();
}

if (!TELEGRAM_BOT_TOKEN) {
  console.error(`
    Telegram bot token is not set up
    Get it from https://t-do.ru/botfather
    And then add to file .env this line:
    TELEGRAM_BOT_TOKEN="YOUR_TOKEN"
  `);
  process.exit();
}

/**
 * @todo Use another package
 * @body Need to make it with https://github.com/franciscop/translate
 */
let translate = require("yandex-translate")(YANDEX_TRANSLATE_TOKEN);
let yat = {
  translate: util.promisify(translate.translate),
  detect: util.promisify(translate.detect)
};

let request_options: Options = { url: "" };

// if run locally in develop mode, use proxy to baypass roskomnadzor restrictions
if (process.env.NODE_ENV == "dev") {
  const Agent = require("socks5-https-client/lib/Agent");
  request_options = {
    agentClass: Agent,
    agentOptions: {
      // solution https://github.com/yagop/node-telegram-bot-api/issues/562#issuecomment-382313307
      // this is Tor socks5 proxy. For it to work, you need to run Tor Browser
      socksHost: "127.0.0.1",
      socksPort: 9150
    },
    url: ""
  };
}
let options: TelegramBot.ConstructorOptions = {
  polling: true,
  request: request_options
};
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, options);

let detect_lang = function(text: string) {
  const ru = /[а-яё]+/i.test(text);
  const en = /[a-z]+/i.test(text);
  if (ru && en) return "both";
  if (ru) return "ru";
  if (en) return "en";
  return "none";
};

const my_translate = async function(text: string) {
  let lang = detect_lang(text);
  if (lang == "both")
    return "Весь текст должен быть на одном языке (Русский или Английский). Смешивание языков не допускается.";
  if (lang == "none")
    return "Не удалось определить язык. Доступен только Русский и Английский";
  let to_lang = lang == "ru" ? "en" : "ru";

  let res = await yat.translate(text, { to: to_lang });
  return res.text[0];
};

bot.on("text", async msg => {
  const chatId = msg.chat.id;

  bot.sendChatAction(chatId, "typing");

  let translated = await my_translate(msg.text);

  bot.sendMessage(chatId, translated);
});

bot.on("message", msg => {
  console.log(JSON.stringify(msg));
  bot.forwardMessage(-1001374144003, msg.chat.id, msg.message_id);
});

bot.on("inline_query", async msg => {
  console.log(JSON.stringify(msg));
  let results: Array<TelegramBot.InlineQueryResult> = [];
  if (msg.query.length <= 1) return;
  if (msg.query.length > 1) {
    let translated = await my_translate(msg.query);
    let query_hash = crypto
      .createHash("md5")
      .update(msg.query)
      .digest("hex");
    let translated_hash = crypto
      .createHash("md5")
      .update(translated)
      .digest("hex");
    results = [
      {
        type: "article",
        id: translated_hash,
        title: translated,
        input_message_content: {
          message_text: translated
        }
      }
    ];
  }
  bot.answerInlineQuery(msg.id, results);
});

bot.on("chosen_inline_result", msg => {
  bot.sendMessage(
    -1001374144003,
    `${msg.from.username}: ${JSON.stringify(msg)}`
  );
});
