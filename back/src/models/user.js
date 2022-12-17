const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    chatId: { type: Number, required: true },
    status: { type: String, enum: ['creator', 'sweet', 'others'], default: 'others' },
    messages: { type: Number, default: 1 },
    lastMessage: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = model('User', schema);
