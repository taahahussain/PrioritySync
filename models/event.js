const mongoose = require('mongoose');

// Base Event Schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  estimatedTime: Number,
  category: {
    type: String,
    enum: ['religious', 'school', 'work', 'personal', 'worship', 'other'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  files: [
    {
      fileType: String,
      fileUrl: String,
    }
  ], // Files (documents, videos, etc.)
  links: [String], // Associated links (documents, shared drive, etc.)
});

// Define a discriminator key for distinguishing between different event types
eventSchema.set('discriminatorKey', 'eventType');

// Export the base Event model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
