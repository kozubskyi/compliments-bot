const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    text: { type: String, required: true },
    sendings: { type: Number, default: 0 },
    lastSending: { type: Date, default: null },
    created: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = model('Compliment', schema);
