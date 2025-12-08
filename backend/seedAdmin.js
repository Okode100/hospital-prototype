const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const pw = process.env.ADMIN_PASSWORD || 'adminpassword';

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    return process.exit(0);
  }
  const hash = await bcrypt.hash(pw, 12);
  await Admin.create({ email, password: hash });
  console.log('Admin created:', email);
  process.exit(0);
}
seedAdmin();
