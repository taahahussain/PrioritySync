const mongoose = require('mongoose');
const Event = require('./event'); // Import base Event model

// School Class Schema
const schoolClassSchema = new mongoose.Schema({
  instructorName: {
    type: String,
    required: true,
  },
  sectionNumber: String,
  assignmentType: {
    type: String,
    enum: ['homework', 'project', 'test', 'quiz'],
    required: true,
  },
  groupAssignment: {
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupMembers: Number, // If group assignment, number of group members
    sharedDocuments: [String], // Links to shared documents
  },
});

// Create and export the SchoolClass model
const SchoolClass = Event.discriminator('SchoolClass', schoolClassSchema);
module.exports = SchoolClass;
