const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    relation: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const emergencyPhysicianSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const historyEntrySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    date: Date,
    notes: String,
  },
  { _id: false }
);

const screeningHistorySchema = new mongoose.Schema(
  {
    facility: String,
    date: Date,
    type: String,
    result: String,
    notes: String,
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, trim: true },
    dateOfBirth: Date,
    gender: String,
    bloodGroup: String,
    registrationDate: Date,
    phone: String,
    email: String,
    address: String,
    emergencyContacts: [emergencyContactSchema],
    emergencyPhysician: emergencyPhysicianSchema,
    medicalHistory: {
      generalHistory: [historyEntrySchema],
      maternalReproductiveHistory: [historyEntrySchema],
      allergies: [historyEntrySchema],
      surgicalHistory: [historyEntrySchema],
      medications: [historyEntrySchema],
    },
    screeningHistory: [screeningHistorySchema],
    extraData: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);

