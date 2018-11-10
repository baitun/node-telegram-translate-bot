# node-telegram-translate-bot
Simple Telegram translate bot [@justtranslate_bot](https://tele.click/justtranslate_bot)  

![screenshot](https://pp.userapi.com/c850732/v850732137/2571f/sWmZvx1h4jI.jpg)

## How to start

```sh
npm -g i pm2 yarn
git clone https://github.com/baitun/node-telegram-translate-bot.git
cd node-telegram-translate-bot
yarn install
```
Then you need to get tokens:
- You can get Yandex translate token here: https://translate.yandex.ru/developers/keys
- To get Telegram bot token, message to [@BotFather](https://tele.click/botfather)

And then add this tokens to `.env` file (this file is not tracking, so you need to create it). File should look like this:
```
YANDEX_TRANSLATE_TOKEN=""
TELEGRAM_BOT_TOKEN=""
```

Then you can start bot with `yarn start`

If Telegram is blocked in your country and you don't have VPN, open the Tor Browser and use following command:
```sh
NODE_ENV="dev" yarn start
```

## Deploy with PM2

To deploy bot on server, edit [ecosystem.config.js](ecosystem.config.js) file and run:
```sh
pm2 deploy production setup
pm2 deploy production update
```
[Learn more about pm2 deploy](https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/)

## Dependencies
- [yandex-translate](https://github.com/sidorares/yandex-translate)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

## Contacts
If you have any questions, feel free to contact me via Telegram: [@savinyurii](https://tele.click/savinyurii)
