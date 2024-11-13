const isItLenaRak = ctx => ctx.from.id === Number(process.env.LENA_RAK_CHAT_ID)
const isItKozubskyi = ctx => ctx.from.id === Number(process.env.KOZUBSKYI_CHAT_ID)

const sendInfoMessageToCreator = async (ctx, reply) => {
	if (!isItKozubskyi(ctx)) {
		const { first_name, last_name, username, id } = ctx.from

		const chatId = Number(process.env.KOZUBSKYI_CHAT_ID)
		const infoReply = `Користувач ${first_name} ${last_name}${
			username ? ` (@${username})` : ''
		} ${id} відправив повідомлення "${ctx.message.text}" і отримав відповідь:\n\n${reply}`

		await ctx.telegram.sendMessage(chatId, infoReply)
	}
}

module.exports = {
	isItLenaRak,
	isItKozubskyi,
	sendInfoMessageToCreator,
}
