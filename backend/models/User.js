const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  globalCoins: { type: Number, default: 5000 },
  exp: { type: Number, default: 0 },
  matchesPlayed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
