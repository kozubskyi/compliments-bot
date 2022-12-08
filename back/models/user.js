const { Schema, model } = require("mongoose")

const schema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, required: true },
    chatId: { type: Number, required: true },
    messages: Number,
    groups: [
      {
        type: String,
        enum: ["creator", "sweet", "family", "friends", "others"],
        default: "others",
      },
    ],
  },
  { versionKey: false }
)

module.exports = model("User", schema)

