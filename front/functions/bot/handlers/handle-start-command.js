const { isItLenaRak, isItKozubskyi, sendInfoMessageToCreator } = require('../helpers/helpers')
const handleError = require('./handle-error')

module.exports = async function handleStartCommand(ctx) {
	try {
		let reply

		if (isItLenaRak(ctx)) {
			reply =
				'Лєнусік, привіт) 😊 Денис просив передати тобі багато компліментиків) ☺️ Відправ повідомлення з текстом /compliment 😘'
		} else {
			const { first_name, last_name, username } = ctx.from
			reply = `Привіт, ${first_name || username || last_name} 👋 Чим можу допомогти? 😊`
		}

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx, reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
