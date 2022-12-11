const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    type: { type: String, enum: ['compliment', 'wish'] },
    text: { type: String, required: true },
    sendings: { type: Number, default: 0 },
    for: [
      {
        type: String,
        enum: ['creator', 'sweet', 'others'],
        // default: 'sweet',
      },
    ],
    created: String,
    // created: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

module.exports = model('Message', schema)
