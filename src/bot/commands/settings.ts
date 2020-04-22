import { createUser } from '../../db/models'

import { TlgfCtxT } from "../bot"


import { ToTranslate, TrKeys, parseLanguageCode } from '../../i18n'

export async function setLanguageCode(ctx: TlgfCtxT) {
  const { db, dbUser, message } = ctx
  console.log('db', db);

  if (dbUser && message && message.text) {
    const msgParts = message.text.split(/\s/)

    if (msgParts.length === 2) {
      const languageCode = parseLanguageCode(msgParts[1])
      const updatedUser = createUser(dbUser)
      updatedUser.language_code = languageCode
      const updatedDBUser = await db.users.update(updatedUser)
      if (updatedDBUser) {
        return new ToTranslate(TrKeys.UPDATED_LANGUAGE,
          updatedDBUser.language_code,
          {
            old_language_code: dbUser.language_code,
            new_language_code: updatedDBUser.language_code,
          }
        )
      } else {
        console.log('WTF');

      }
    }
  }
}

export async function settingsHandler(ctx: TlgfCtxT) {
  const { from, chat, dbUserLanguageCode } = ctx
  if (from && chat) {
    ctx.reply(`
      chat id: ${chat.id}
      user id: ${from.id}
      username: ${from.username}
      language: ${dbUserLanguageCode}
    `)
  }
}
