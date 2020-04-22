import i18next from 'i18next'

export type i18nTrT = i18next.TFunction

export enum LanguageCodeEnum {
  Engilsh = 'en',
  Russian = 'ru'
}

export function parseLanguageCode(toParseLng?: string) : LanguageCodeEnum {
  if (typeof toParseLng === 'string') {
    switch (toParseLng) {
      case LanguageCodeEnum.Engilsh:
        return LanguageCodeEnum.Engilsh
      case LanguageCodeEnum.Russian:
        return LanguageCodeEnum.Russian
    }
  }
  throw new Error(`Could not parse language ${toParseLng}`)
}

export enum TrKeys {
  REGISTERED         = 'REGISTERED',
  ALREADY_REGISTERED = 'ALREADE_REGISTERED',
  UPDATED_LANGUAGE   = 'UPDATED_LANGUAGE',
}



export async function initializeI18Next(): Promise<i18nTrT> {
  return new Promise((res, rej) => {
    i18next.init({
      lng: LanguageCodeEnum.Engilsh,
      // debug: true,
      resources: {
        [LanguageCodeEnum.Engilsh]: {
          translation: {
            [TrKeys.REGISTERED]:  `You are registered! {{first_name}}`,
            [TrKeys.ALREADY_REGISTERED]:  `You are already registered! {{first_name}}`,
            [TrKeys.UPDATED_LANGUAGE]:  `Language {{old_language_code}} updated to {{new_language_code}}`,
          }
        },
        [LanguageCodeEnum.Russian]: {
          translation: {
            [TrKeys.REGISTERED]:  `Вы зарегистрированы! {{first_name}}`,
            [TrKeys.ALREADY_REGISTERED]:  `Вы уже зарегистрированы! {{first_name}}`,
            [TrKeys.UPDATED_LANGUAGE]: `Язык {{old_language_code}} обновлен на {{new_language_code}}`,
          }
        }
      }
    },
    (err, t: i18nTrT) => {
      if (err) {
        rej(err)  // вместо throw  или try catch
      } else {
        res(t) // типа вместо ретурна
      }
    })
  })
}

// const resp = await fetch(url) вернет чистый результат не промис

export function translateResult(t: i18nTrT, toTranslate: ToTranslate) {
  const data = toTranslate.data ? toTranslate.data : {}
  data.lng = toTranslate.language_code
  return t(toTranslate.key, data)
}

export class ToTranslate {
  constructor(
    public key: TrKeys,
    public language_code?: LanguageCodeEnum,
    public data?: {[index: string]: any}
  ) {}
}
