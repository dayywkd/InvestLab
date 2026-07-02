const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. Get or Create User (Sync)
router.post('/sync', async (req, res) => {
  const { username, level, globalCoins, exp } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, level, globalCoins, exp });
      await user.save();
    } else {
      if (level !== undefined) user.level = level;
      if (globalCoins !== undefined) user.globalCoins = globalCoins;
      if (exp !== undefined) user.exp = exp;
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ globalCoins: -1 })
      .limit(10);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
