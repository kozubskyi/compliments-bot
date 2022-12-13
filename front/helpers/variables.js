const { KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID } = process.env;

module.exports = {
  CREATOR_CHAT_ID: Number(KOZUBSKYI_CHAT_ID),
  SWEET_CHAT_ID: Number(LENA_RAK_CHAT_ID),
};
