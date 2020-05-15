module.exports.chatId =  function chatId (msg) {
// Если сообщение отправлял пользователь, то свойство msg.chat.id, если же он кликал на кнопку, то msg.from.id
  return msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id
}