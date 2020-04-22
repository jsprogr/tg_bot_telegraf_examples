import Telegraf, { ContextMessageUpdate} from 'telegraf'
import HttpsProxyAgent from 'https-proxy-agent'
import {HttpsProxyAgentOptions} from 'https-proxy-agent'

import {BotConfigT, ConfigT} from '../config'
import { DBT } from '../db'

import {startHandler, helpHandler, setLanguageCode, settingsHandler  } from './commands'
import { BotCommandEnum, getCmdStr } from './commands/commands'
import { LanguageCodeEnum, i18nTrT, ToTranslate, translateResult, initializeI18Next } from '../i18n'
import { DEFAULT_USER_LANGUAGE_CODE, UserModel } from '../db/models'


export type TelegrafBotT = Telegraf<ContextMessageUpdate>
export type TlgfCtxT = ContextMessageUpdate & {
  db: DBT,
  fromUserId: number,
  fromUserIdStr: string,
  fromFirstName: string,
  fromUserName: string,
  dbUser: UserModel | null,
  dbUserLanguageCode: LanguageCodeEnum
}

const opts: HttpsProxyAgentOptions = {
  host: '112.169.811.113',
  port: 50059,
  //TLwoYKp3s1:KuLIuzPXAC
}
const agent = new HttpsProxyAgent('http://')

export function createTlgfBot(config: BotConfigT) : TelegrafBotT {
  const bot = new Telegraf(config.bot_token, {telegram: { agent }})
  return bot
}

function AugmentCtx(db: DBT) {
  return async (ctx: ContextMessageUpdate, next?: Function) => {
    const newCtx = <TlgfCtxT>ctx
    newCtx.db = db
    const { from } = newCtx
    if (from) {
      const { id, first_name, username } = from
      const idStr = String(id)
      newCtx.fromUserId = id
      newCtx.fromUserIdStr = idStr
      newCtx.fromFirstName = first_name
      newCtx.fromUserName = username || ''
      const dbUser = await db.users.findById(idStr)
      if (dbUser) {
        newCtx.dbUserLanguageCode = dbUser.language_code
      } else {
        newCtx.dbUserLanguageCode = DEFAULT_USER_LANGUAGE_CODE
      }
      newCtx.dbUser = dbUser
      return next && next()
    }
  }
}

function I18nTranslate(t: i18nTrT) {
  return (ctx: TlgfCtxT, next?: Function) => {
    const promise = next && next()
    if (promise) {
      promise.then((result: any) => {
        if (result && result instanceof ToTranslate) {
          const text = translateResult(t, result)
          ctx.reply(text)
        }
      })
      // .catch((err: any) => {
      //   console.log(err);
      // })
    }
  }
}

export async function initializeTlgfBot(tlgfBot: TelegrafBotT, db: DBT, config: ConfigT) {
  const t = await initializeI18Next()
  console.log(t)

  tlgfBot.use(AugmentCtx(db))
  tlgfBot.use(<any>I18nTranslate(t))
  tlgfBot.command(getCmdStr(BotCommandEnum.start), <any>startHandler)
  tlgfBot.command(getCmdStr(BotCommandEnum.settings), <any>settingsHandler)
  tlgfBot.command(getCmdStr(BotCommandEnum.help), <any>helpHandler)
  tlgfBot.command(getCmdStr(BotCommandEnum.setlang), <any>setLanguageCode);
  return tlgfBot.launch()
    .then(() =>  console.log('Бот запустился'))
    .catch((err) => console.log('Бот не запустился', err));
}

export function destroyTlgfBot(tlgfBot: TelegrafBotT) {
  return tlgfBot.stop()
}
