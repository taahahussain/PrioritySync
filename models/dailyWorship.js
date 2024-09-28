const mongoose = require('mongoose');
const Event = require('./event'); // Import base Event model

// Daily Worship Schema
const worshipSchema = new mongoose.Schema({
  worshipType: {
    type: String,
    enum: ['prayer', 'quran'],
    required: true,
  },
  prayerTime: {
    type: String,
    enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'],
    required: function() { return this.worshipType === 'prayer'; }, // Required if it's a prayer
  },
  quranRecitation: {
    surah: String,
    juz: Number,
    fromAyah: Number,
    toAyah: Number,
    required: function() { return this.worshipType === 'quran'; }, // Required if it's Qur'an recitation
  },
});

// Create and export the Worship model
const Worship = Event.discriminator('Worship', worshipSchema);
module.exports = Worship;
