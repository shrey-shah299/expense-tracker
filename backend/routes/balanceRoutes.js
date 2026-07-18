const express = require('express');
const router = express.Router();
const Balance = require('../models/balance');

// POST /api/balance/adjust
// Body: { mode: 'cash'|'HDFC'|'SBI', amount: Number, type: 'add'|'remove' }
router.post('/balance/adjust', async (req, res) => {
  try {
    const { mode, amount, type } = req.body;

    if (!mode || !amount || !type) {
      return res.status(400).json({ error: 'mode, amount, and type are required' });
    }

    if (!['cash', 'HDFC', 'SBI'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode. Must be cash, HDFC, or SBI' });
    }

    if (!['add', 'remove'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be add or remove' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const entry = new Balance({ mode, amount: Number(amount), type });
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/balance/current
// Returns: { cash: N, hdfc: N, sbi: N }
router.get('/balance/current', async (req, res) => {
  try {
    const entries = await Balance.find();

    const totals = { cash: 0, hdfc: 0, sbi: 0 };

    entries.forEach(entry => {
      const key = entry.mode.toLowerCase();
      if (entry.type === 'add') {
        totals[key] = (totals[key] || 0) + entry.amount;
      } else if (entry.type === 'remove') {
        totals[key] = (totals[key] || 0) - entry.amount;
      }
    });

    res.status(200).json(totals);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/balance/history
// Returns all balance adjustment events sorted newest first
router.get('/balance/history', async (req, res) => {
  try {
    const history = await Balance.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
