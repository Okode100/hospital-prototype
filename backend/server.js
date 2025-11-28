const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital prototype API' });
});

// Patient routes
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patient', patientRoutes);

// Alias for listing all patients (plural form)
app.get('/api/patients', async (req, res) => {
  try {
    const Patient = require('./models/Patient');
    const { limit, skip, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = Patient.find();
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query.sort(sortOptions);
    
    if (skip) {
      query.skip(parseInt(skip));
    }
    if (limit) {
      query.limit(parseInt(limit));
    }
    
    const patients = await query;
    const total = await Patient.countDocuments();
    
    res.json({
      success: true,
      data: patients,
      total: total,
      count: patients.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(MONGO_URI);
    
    console.log('✓ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`✓ Server listening on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api/patient`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
