const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  url: { type: String, required: true },
  totalClicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastClicked: { type: Date, default: null },
});

module.exports = mongoose.model('Link', LinkSchema);
