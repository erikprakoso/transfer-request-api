// models/TransferRequest.js
const mongoose = require('mongoose');

const transferRequestSchema = new mongoose.Schema({
  senderAccount: {
    type: String,
    required: true,
  },
  recipientAccount: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Status hanya bisa berupa 'pending', 'approved', atau 'rejected'
    default: 'pending', // Status default adalah 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('TransferRequest', transferRequestSchema);
