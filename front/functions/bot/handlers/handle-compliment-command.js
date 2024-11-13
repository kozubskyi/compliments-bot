const axios = require('axios')
const { isItLenaRak, sendInfoMessageToCreator } = require('../helpers/helpers')
const handleError = require('./handle-error')

async function getRandomCompliment() {
	const { DB_BASE_URL } = process.env

	const { data } = await axios.get(`${DB_BASE_URL}/compliments`)

	if (!data.length) {
		return 'На жаль поки що я не маю компліментиків, вибач 😥'
	}

	const randomIndex = Math.floor(Math.random() * data.length)

	const chosenCompliment = data[randomIndex]
	const { _id, sendings } = chosenCompliment

	axios.patch(`${DB_BASE_URL}/compliments/${_id}`, {
		sendings: sendings + 1,
		lastSending: Date.now(),
	})

	return chosenCompliment.text
}

module.exports = async function handleComplimentCommand(ctx) {
	try {
		let reply

		if (isItLenaRak(ctx)) {
			reply = await getRandomCompliment()
		} else {
			reply = 'Вибач, але компліментики я роблю лише Олені Рак 🤷‍♂️'
		}

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx, reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
