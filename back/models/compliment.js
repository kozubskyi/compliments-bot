const { Schema, model } = require("mongoose")

const schema = new Schema(
  {
    text: { type: String, required: true },
    sentTimes: { type: Number, default: 0 },
    created: String,
    // created: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

module.exports = model("Compliment", schema)

