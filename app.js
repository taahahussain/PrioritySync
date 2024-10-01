

// Importing required modules
require('dotenv').config(); // Must be at the top of your file
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Event = require('./models/event');
const SchoolClass = require('./models/schoolWork');
const { sortTasksByScore, findTimeSlotAndScheduleTask } = require('./utils/taskScheduler');


// Creating an Express application instance
const app = express();
const PORT = 3000;
const uri  = process.env.MONGO_URI;
console.log(uri);
// Connect to MongoDB database
mongoose.connect(uri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});




// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

// Route to register a new user
app.post('/api/register', async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to authenticate and log in a user
app.post('/api/login', async (req, res) => {
  try {
    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, 'secret');
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route to get user details
app.get('/api/user', verifyToken, async (req, res) => {
  try {
    // Fetch user details using decoded token
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to my User Registration and Login API!');
});

// Route to create a new event and schedule all tasks
app.post('/api/events', async (req, res) => {
  try {
    // Create the new event and save it to the database
    const newEvent = new Event(req.body); 
    const savedEvent = await newEvent.save(); 
    console.log("New event created");

    // Retrieve all events from the database, including the newly created one
    const allEvents = await Event.find();

    // Sort all events by urgency and due date using sortTasksByScore
    const sortedEvents = sortTasksByScore(allEvents);

    // Find available time slots and schedule all tasks
    await findTimeSlotAndScheduleTask(sortedEvents);

    // Send response
    res.status(201).json({ message: "New event created and all tasks scheduled", event: savedEvent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});