const mongoose = require('mongoose');
const Event = require('./event'); // Import base Event model

// Work Task Schema
const workTaskSchema = new mongoose.Schema({
  taskType: {
    type: String,
    enum: ['meeting', 'project', 'training'],
    required: true,
  },
  meetingDetails: {
    link: String,
    agenda: String,
  },
  projectDetails: {
    projectId: String,
    documents: [String], // Associated project documents
  },
  trainingDetails: {
    courseName: String,
    duration: Number, // Training duration in hours
  },
});

// Create and export the WorkTask model
const WorkTask = Event.discriminator('WorkTask', workTaskSchema);
module.exports = WorkTask;
