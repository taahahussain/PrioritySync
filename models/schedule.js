const mongoose = require('mongoose');

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',  // Reference the Event model
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
