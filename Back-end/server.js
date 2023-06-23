const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors());

// Define a schema for the "sectors" collection
const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Define a schema for the "userEntries" collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  selector: {
    type: String,
    required: true
  },
  agree: {
    type: Boolean,
    required: true
  }
});

// Create a model based on the schema
const Sector = mongoose.model('sectors', sectorSchema);
const UserEntry = mongoose.model('userEntries', userSchema);

mongoose.connect('mongodb://127.0.0.1:27017/sectorsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 50,
  wtimeoutMS: 25000,
  socketTimeoutMS: 60000
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// GET route to retrieve sectors from the database
app.get('/sectors', async (req, res) => {
  try {
    const sectors = await Sector.find().exec();
    res.json(sectors);
  } catch (error) {
    console.error('Error retrieving sectors:', error);
    res.status(500).json({ error: 'Failed to retrieve sectors' });
  }
});

// POST route to save entered data in the database
app.post('/sectors', async (req, res) => {
  try {
    const entry = new UserEntry({
      name: req.body.name,
      selector: req.body.selector,
      agree: req.body.agree
    });
    await entry.save();
    res.status(200).send('Entry saved successfully');
  } catch (error) {
    console.error('Error saving entry to the database', error);
    res.status(500).send('Error saving entry to the database');
  }
});

// GET route to retrieve saved entries from the database
app.get('/entries', async (req, res) => {
  try {
    const entries = await UserEntry.find().exec();
    res.json(entries);
  } catch (error) {
    console.error('Error retrieving entries:', error);
    res.status(500).json({ error: 'Failed to retrieve entries' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
