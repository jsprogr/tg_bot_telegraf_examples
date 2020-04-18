import Telegraf from 'telegraf'
import {getConfig} from '../config/config'
import HttpsProxyAgent from 'https-proxy-agent'
import {HttpsProxyAgentOptions} from 'https-proxy-agent'


const config = getConfig('botya')
const token = config.bot_section.bot_token

const opts: HttpsProxyAgentOptions = {
    host: '31.14.131.70',
    port: 8080
}
const agent = new HttpsProxyAgent(opts)

const bot = new Telegraf(token, {telegram: { agent }})
bot.start((ctx) => ctx.reply('Welcome!'))

bot.launch()