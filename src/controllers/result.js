const GROUP = require('../const/group')
const RESULT_PROMOBOT = require('../const/results')

module.exports.result = function result (answers) {

  let result = null
  const temerature = +answers[0].answer === 1
  const arrayForAnalize = answers.filter((a, index) => index !== 0)
  const arrayTrueAnswers = arrayForAnalize.filter(a => +a.answer === 1)
  // 3 - группа один из 6, 7, 8
  if (arrayTrueAnswers.find(a => [6, 7, 8].includes(a.id))) {
    result = 3
  }
  //  первая группа есть температура  + один из 2, 3, 4, 5
  if (temerature && arrayTrueAnswers.find(a => [2, 3, 4, 5].includes(a.id))) {
    result = 1
  }
  // группа 2  - один из 6, 7, 8 && result === 1
  if (result === 1 && arrayTrueAnswers.find(a => [6, 7, 8].includes(a.id))) {
    result = 2
  }
  if (temerature && arrayTrueAnswers.find(a => [6, 7, 8].includes(a.id))) {
    result = 2
  }

  // 4 группа нет контактов и температуры 6, 7, 8, 9
  if (!temerature && !arrayTrueAnswers.find(a => [6, 7, 8].includes(a.id))) result = 4
  return {result: getTextResult(result || 5), group: getGroup(result || 5)}
}
function getTextResult(result) {
  if (result === 4) return RESULT_PROMOBOT.VERY_GOOD
  if (result === 5) return RESULT_PROMOBOT.GOOD
  if (result === 1) return RESULT_PROMOBOT.NOT_GOOD
  if (result === 2) return RESULT_PROMOBOT.NOT_GOOD
  if (result === 3) return RESULT_PROMOBOT.BAD
}

function getGroup(data) {
  return GROUP[data]
}