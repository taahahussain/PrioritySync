const mongoose = require('mongoose');
const Event = require('./event'); // Import base Event model

// Religious Event Schema
const religiousEventSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  occurrence: {
    type: String,
    enum: ['once', 'weekly', 'monthly'], // How often it happens
    required: true,
  },
});

// Create and export the ReligiousEvent model based on the Event model
const ReligiousEvent = Event.discriminator('ReligiousEvent', religiousEventSchema);
module.exports = ReligiousEvent;
