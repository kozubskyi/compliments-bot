const { KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID } = process.env

module.exports = {
  BOT_USERNAME: 'kozubskyi_bot',
  CREATOR_USERNAME: 'kozubskyi',
  CREATOR_CHAT_ID: Number(KOZUBSKYI_CHAT_ID),
  SWEET_CHAT_ID: Number(LENA_RAK_CHAT_ID),
}
