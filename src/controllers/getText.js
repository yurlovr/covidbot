let test = false

module.exports.getText = function getText(msg) {
  if(msg.text === '/start') return null
  if (['привет', 'ghbdtn'].find(i => i === msg.text)) {
    return `Привет, ${msg.from.first_name}! 😉
    Как у тебя дела?`
  }
  if (['как дела', 'rfr ltkf'].find(i => i === msg.text)) {
    return 'Отлично! А у Вас?'
  }
  if(['да', 'давай', 'хочу', 'lf', 'ok'].find(i => i === msg.text)) {
    if (test === 1) {
      test = false
      return 'тест'
    }
    if (test === 2) {
      test = false
      return 'cat'
    }
  }
  if (test === 1 && ['нет', 'не хочу', 'no'].find(i => i === msg.text)) {
    test = 2
    return 'Может посмотрим котиков? 😜'
  }
  if (['gjujlf', 'погода', 'какая погода'].find(i => i === msg.text)) {
    return `Сегодня - Весна! Апрель!
    На улице светит ☀,
    растут 🌺🌺🌺 , поют 🐦🐦🐦!
    А Вы 👉 - сидите 🏢, у нас самоизаляция!!! 😷`
  }
  test = 1
  return 'Хотите пройти тест на симптомы коронавирусной инфекции COVID-19?'
}