const { isItKozubskyi, sendInfoMessageToCreator } = require('../helpers/helpers')
const handleError = require('./handle-error')

module.exports = async function handleHelpCommand(ctx) {
	try {
		let reply

		if (isItKozubskyi(ctx)) {
			reply = `🗣️ <b>Команди</b>

💁‍♂️ <b>Стандарті:</b>
/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/help - отримати список усіх можливих команд

⭐️ <b>Адміністраторські:</b>
<u>add "text"</u> - додати у базу даних новий компліментик з текстом "text";
<u>show "id"</u> - отримати повну інформацію про компліментик з id "id";
<u>del "key" "idOrText"</u> - видалити з бази даних повідомлення з полем "key" (id або text) та значенням цього поля "idOrText";
<u>upd "collection" "id" "field" "value"</u> - оновити поле "field" колекції "collection" (user або compliment) з id "id" в базі даних новим значенням "value";
<u>mlr "text"</u> - відправити повідомлення Олені Рак з текстом "text";
<u>msg "name" "surname" "text"</u> - відправити повідомлення користувачу, який є у базі даних, з ім'ям "name", прізвищем "surname" і текстом "text";
<u>u "page"</u> - отримати масив 20-ти користувачів пагінації "page" з бази даних;
<u>c "page"</u> - отримати масив 20-ти компліментиків пагінації "page" з бази даних;
<u>/uq</u> - отримати кількість усіх користувачів у базі даних;
<u>/cq</u> - отримати кількість усіх компліментів у базі даних;
<u>/test</u> - тестова команда.`
		} else {
			reply = `🗣️ <b>Команди</b>

/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/help - отримати список усіх можливих команд

Також можна просто написати повідомлення, а я передам його Денису`
		}

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx, reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
