const TelegramBot = require('node-telegram-bot-api')
const Agent = require('socks5-https-client/lib/Agent')
const TOKEN = '1081045081:AAFyBeTsbh43D5mukMmk6kuQX6Hg2Y17KdQ'
const QUESTIONS_PROMOBOT = require('./src/const/question')
const BUTTONS = require('./src/const/buttons')
const TIMER_MAIN = require('./src/const/timerMain')
const TIMER_BACK = require('./src/const/timerBack')
const { chatId } = require('./src/controllers/chatId')
const { result } = require('./src/controllers/result')
const { giveMePhotoCat } = require('./src/controllers/giveMePhotoCat')
const { getText } = require('./src/controllers/getText')
const bot = new TelegramBot(TOKEN, {polling: true,})
let timerGoMain = null
let timerGoBack = null
let userResult = {
  start: false,
  quest: [],
  msgId: null
}
let arrayIdQuestion = QUESTIONS_PROMOBOT.filter(i => i.id)
bot.onText(/\/start/, function (msg, match) {
  startQuest(msg, userResult)
})

bot.on('callback_query', function (msg) {
  newQuestion(msg, userResult)
})
bot.on('message', msg => {
  timerGoMain = clearTimer(timerGoMain)
  timerGoBack = clearTimer(timerGoBack)
  let result = getText(msg)
  if(!result) return
  if (result === 'тест') {
    newQuestion(msg, userResult, true)
    return
  } else if (result === 'cat') {
    mainPage(chatId(msg), 'Котиков, так котиков!!! 😸')
    return
  } else {
    send(msg.chat.id, result)
  }
  timerGoMain = setTimeout(() => {
    startQuest(msg)
  }, TIMER_MAIN)
})

bot.on('polling_error', (err) => console.log(err))

function startQuest(msg) {
  timerGoMain = clearTimer(timerGoMain)
  timerGoBack = clearTimer(timerGoBack)
  initial()
  const text = 'Пройди тест! Узнай, есть ли у тебя симптомы коронавирусной инфекции (COVID-19)'
  const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [ BUTTONS.START ],
      })
    }
    const chat = chatId(msg)
    send(chat, text, options)
}

function newQuestion(msg, userResult, editMessage) {
  const chat = chatId(msg)
  let text = ''
  let options = {}
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [],
      })
    }
    if (!editMessage) {
      hideButtons(chat, msg.message ? msg.message.message_id : msg.message_id )
    }
  const data = msg.data
  if (data === 'cat') {
    timerGoBack = clearTimer(timerGoBack)
    timerGoMain = clearTimer(timerGoMain)
    timerGoMain = setTimeout(() => {
      startQuest(msg)
    }, TIMER_MAIN)
    console.log(timerGoMain)
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [ BUTTONS.MAIN_CAT ]
      })
    }
    giveMePhotoCat()
      .then(photo => {
        bot.sendPhoto(chat, photo, options)
      })
      .catch((e) => {
        console.log(e)
        bot.sendMessage(chat,'Наш фотограф еще не успел сделать фото. Давайте чуть позже 😉')
      })
      return
    }
  if (data === 'start') {
    userResult.start = true
    clearTimer(timerGoMain)
  }
  if (data === 'end') {
    initial()
    mainPage(chat)
    return
  }
  if (data === 'defense') {
    timerGoBack = clearTimer(timerGoBack)
    timerGoMain = clearTimer(timerGoMain)
    timerGoMain = setTimeout(() => {
      startQuest(msg)
    }, TIMER_MAIN)
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [ BUTTONS.MAIN_CAT ]
      })
    }
    const photo = './src/assets/images/defence.jpg'
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [ BUTTONS.MAIN_CAT ]
      })
    }
    bot.sendPhoto(chat, photo, options)
    return
  }
  if (userResult.quest.length) {
    userResult.quest[userResult.quest.length - 1].answer = data
  }
  if (arrayIdQuestion.length) {
    const question = arrayIdQuestion[0]
    timerGoBack = clearTimer(timerGoBack)
    timerGoBack = setTimeout(() => {
      startQuest(msg)
    },TIMER_BACK)
    userResult.quest = userResult.quest.concat(question)
    arrayIdQuestion = arrayIdQuestion.filter(item => item.id !== question.id)
    text = question.quest
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard:[ BUTTONS.QUEST ],
      })
    }
  } else {
    const userTest = result(userResult.quest)
    text = userTest.group + '\r\n' + '\r\n' + userTest.result.text
    options = {
      reply_markup: JSON.stringify({
        inline_keyboard: [ BUTTONS.END ]
      })
    }
  }
  send(chat, text, options)
}

function send (chat, text, options) {
  bot.sendMessage(chat, text, options)
}

function initial () {
  initialResult()
  initialQuest()
}
function initialResult () {
  userResult = {
    start: false,
    quest: []
  }
  arrayIdQuestion = QUESTIONS_PROMOBOT.filter(i => i.id)
}

function initialQuest () {
  arrayIdQuestion = QUESTIONS_PROMOBOT.filter(i => i.id)
}
function mainPage(chat, message) {
  const text = message || 'Вы можете пройти тест еще раз, или посмотреть котиков 😉'
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [ BUTTONS.MAIN_CAT, BUTTONS.DEFENSE ]
    })
  }
  send(chat, text, options)
}

function clearTimer (timer)  {
  if (timer) {
    clearTimeout(timer)
    return null
  }
}

function hideButtons(chat, messageId) {
  bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chat, message_id:messageId })
}