const { Schema, model } = require("mongoose")

const schema = new Schema(
  {
    text: { type: String, required: true },
  },
  { versionKey: false }
)

module.exports = model("Compliment", schema)

