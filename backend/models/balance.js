const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  mode: {
    type: String,
    required: true,
    enum: ['cash', 'HDFC', 'SBI'],
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['add', 'remove'],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
});

module.exports = mongoose.model('Balance', balanceSchema);
