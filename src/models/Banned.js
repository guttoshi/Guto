const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true
  },
  banned: {
    type: Boolean,
    required: true,
  },
});

module.exports = model('Banned', userSchema);