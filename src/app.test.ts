import {getConfig} from './config'
import {createApp, initializeApp} from './app'
import { errorMonitor } from 'events'

async function run() {
  const config = getConfig('config')
  const app = createApp(config)
  return initializeApp(app)
}

run().catch((err) => {
  console.error('Ошибка запуска:\n', err)
  process.exit(1)
})
