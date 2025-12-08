const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/api/auth', authRoutes);

// JWT Middleware (for protected routes)
function requireAuth(role) {
  return (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : undefined);
    if (!token) return res.status(401).json({ success: false, message: 'No token. Not authenticated.' });
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt');
      req.user = user;
      if (role && user.role !== role) {
        return res.status(403).json({ success: false, message: 'Forbidden. Wrong role.' });
      }
      next();
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
  };
}

// Patient routes (protect mutation routes)
const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patient', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT') {
    return requireAuth('admin')(req, res, next);
  }
  next();
}, patientRoutes);

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
