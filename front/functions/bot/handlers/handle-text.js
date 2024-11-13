const axios = require('axios')
const { isItKozubskyi, isItLenaRak, sendInfoMessageToCreator } = require('../helpers/helpers')
const handleError = require('./handle-error')

function separateFirstWord(msg) {
	const msgArr = msg.split(' ')
	const cmd = msgArr.shift()
	const text = msgArr.join(' ')

	return [cmd, text]
}

async function handleCreatorCommands(ctx) {
	let reply

	const [command, rest] = separateFirstWord(ctx.message.text)

	const { DB_BASE_URL } = process.env

	if (command === 'add') {
		const { data } = await axios.post(`${DB_BASE_URL}/compliments`, { text: rest })

		reply = `✅ Компліментик додано в базу даних: ${JSON.stringify(data)}`
	} else if (command === 'show') {
		const { data } = await axios.get(`${DB_BASE_URL}/compliments/${rest}`)

		reply = JSON.stringify(data)
	} else if (command === 'del') {
		const [key, idOrText] = separateFirstWord(rest)

		const { data } = await axios.delete(`${DB_BASE_URL}/compliments/${key}/${idOrText}`)

		if (data) {
			reply = `✅ Компліментик успішно видалено з бази даних: ${JSON.stringify(data)}`
		} else {
			reply = 'ℹ️ Такого компліментика і не було у базі даних'
		}
	} else if (command === 'upd') {
		const [collection, idFieldAndNewValue] = separateFirstWord(rest)
		const [id, fieldAndNewValue] = separateFirstWord(idFieldAndNewValue)
		const [field, newValue] = separateFirstWord(fieldAndNewValue)

		const { data } = await axios.patch(`${DB_BASE_URL}/${collection}/${id}`, {
			[field]: newValue,
		})

		if (data) {
			reply = `✅ Компліментик успішно оновлено у базі даних: ${JSON.stringify(data)}`
		} else {
			reply = `⚠️ Компліментика з id ${id} немає в базі даних`
		}
	} else if (command === 'mlr') {
		await ctx.telegram.sendMessage(SWEET_CHAT_ID, rest)

		reply = '✅ Повідомлення Лєнусічкє відправлено'
	} else if (command === 'msg') {
		const [name, surnameAndText] = separateFirstWord(rest)
		const [surname, text] = separateFirstWord(surnameAndText)

		const { data } = await axios.get(`${DB_BASE_URL}/users/${name}/${surname}`)

		if (data) {
			await ctx.telegram.sendMessage(data.chatId, text)
			reply = '✅ Повідомлення відправлено'
		} else {
			reply = '⚠️ Такого користувача немає у базі даних'
		}
	} else if (command === 'u' || command === 'c') {
		let collection = ''
		if (command === 'u') collection = 'users'
		if (command === 'c') collection = 'compliments'

		const { data } = await axios.get(`${DB_BASE_URL}/${collection}`)

		reply = JSON.stringify(data.slice(rest * 20 - 20, rest * 20))
	} else if (ctx.message.text === '/uq' || ctx.message.text === '/cq') {
		let collection = ''
		if (command === '/uq') collection = 'users'
		if (command === '/cq') collection = 'compliments'

		const { data } = await axios.get(`${DB_BASE_URL}/${collection}`)

		reply = `${data.length}`
	} else if (ctx.message.text === '/test') {
		reply = '✅'
	} else {
		reply = '⚠️ Некоректна команда'
	}

	return reply
}

module.exports = async function handleText(ctx) {
	try {
		let reply

		if (isItKozubskyi(ctx)) {
			reply = await handleCreatorCommands(ctx)
		} else if (isItLenaRak(ctx)) {
			reply = 'Я передам Денису те, що ти написала) 😘'
		} else {
			reply = 'Я передам Денису це повідомлення 😉'
		}

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx, reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
