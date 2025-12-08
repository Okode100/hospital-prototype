const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Admin = require('../models/Admin');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
};

// Helper to create JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Unified login for admin/patient
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password, and role required.' });
  }
  try {
    let user, Model;
    if (role === 'admin') {
      Model = Admin;
    } else if (role === 'patient') {
      Model = Patient;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }
    user = await Model.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    // Token
    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role, serialNumber: user.serialNumber || undefined }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Whoami (returns user info from JWT)
router.get('/whoami', (req, res) => {
  const token = req.cookies?.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ','') : undefined);
  if (!token) return res.json({ user: null });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
