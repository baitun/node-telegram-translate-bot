# node-telegram-translate-bot
Simple Telegram translate bot https://t-do.ru/justtranslate_bot

## How to start
```sh
npm -g i pm2 yarn
yarn install
```
Then you need to get tokens
- You can get Yandex translate token here: https://translate.yandex.ru/developers/keys
- To get Telegram bot token, message to [@BotFather](https://t-do.ru/botfather)
```sh
export YANDEX_TRANSLATE_TOKEN="PASTE_YOUR_TOKEN"
export TELEGRAM_BOT_TOKEN="PASTE_YOUR_TOKEN"
```

If Telegram is blocked in your country and you don't have VPN, run Tor Browser and run
```sh
export NODE_ENV="dev"
```

To deploy bot on server, ecdit [ecosystem.config.js](ecosystem.config.js) file and run:
```sh
pm2 deploy production setup
pm2 deploy production update
```
[Learn more about pm2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/)
