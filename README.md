# node-telegram-translate-bot

Simple Telegram translate bot [@justtranslate_bot](https://t-do.ru/justtranslate_bot)

## How to start

You need to get tokens before you start:
- You can get Yandex translate token here: https://translate.yandex.ru/developers/keys
- To get Telegram bot token, message to [@BotFather](https://t-do.ru/botfather)

```sh
npm -g i pm2 yarn
git clone https://github.com/baitun/node-telegram-translate-bot.git
cd node-telegram-translate-bot
yarn install
export YANDEX_TRANSLATE_TOKEN="PASTE_YOUR_TOKEN"
export TELEGRAM_BOT_TOKEN="PASTE_YOUR_TOKEN"
yarn start
```

If Telegram is blocked in your country and you don't have VPN, open the Tor Browser and run following command:
```sh
export NODE_ENV="dev"
```

To deploy bot on server, ecdit [ecosystem.config.js](ecosystem.config.js) file and run:
```sh
pm2 deploy production setup
pm2 deploy production update
```
[Learn more about pm2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/)

## Dependencies
- [yandex-translate](https://github.com/sidorares/yandex-translate)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

## Contacts
If you have any questions, feel free to contact me via Telegram: [@savinyurii](https://t-do.ru/savinyurii)
