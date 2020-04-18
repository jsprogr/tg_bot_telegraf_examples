const Telegraf = require('telegraf')
const HttpsProxyAgent = require('https-proxy-agent')

const agent = new HttpsProxyAgent({
    host: '31.14.131.70',
    port: 8080
})


token = '1117043763:AAG3q7HBXTFSPkvFTk8iGVMMdiz3x3iKXGQ'
const bot = new Telegraf(token, {telegram: { agent }})
bot.start((ctx) => ctx.reply('Welcome!'))

bot.launch()