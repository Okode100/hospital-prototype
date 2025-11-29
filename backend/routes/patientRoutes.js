const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const ScannerEvent = require('../models/ScannerEvent');

/**
 * POST /api/patient
 * Create a new patient
 */
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Serial number already exists',
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message,
    });
  }
});

/**
 * GET /api/patient/:serialNumber
 * Retrieve a patient by serial number
 */
router.get('/:serialNumber', async (req, res) => {
  try {
    const patient = await Patient.findOne({
      serialNumber: req.params.serialNumber,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message,
    });
  }
});

/**
 * PUT /api/patient/:serialNumber
 * Update a patient by serial number
 */
router.put('/:serialNumber', async (req, res) => {
  try {
    // Check if patient exists first
    const existingPatient = await Patient.findOne({
      serialNumber: req.params.serialNumber,
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Process update data - handle nested medicalHistory properly
    const updateData = { ...req.body };

    // Convert date strings to Date objects for nested medicalHistory entries
    if (updateData.medicalHistory) {
      const convertHistoryEntryDates = (entries) => {
        if (!Array.isArray(entries)) return entries;
        return entries.map(entry => ({
          ...entry,
          date: entry.date ? new Date(entry.date) : null
        }));
      };

      if (updateData.medicalHistory.generalHistory) {
        updateData.medicalHistory.generalHistory = convertHistoryEntryDates(
          updateData.medicalHistory.generalHistory
        );
      }
      if (updateData.medicalHistory.maternalReproductiveHistory) {
        updateData.medicalHistory.maternalReproductiveHistory = convertHistoryEntryDates(
          updateData.medicalHistory.maternalReproductiveHistory
        );
      }
      if (updateData.medicalHistory.allergies) {
        updateData.medicalHistory.allergies = convertHistoryEntryDates(
          updateData.medicalHistory.allergies
        );
      }
      if (updateData.medicalHistory.surgicalHistory) {
        updateData.medicalHistory.surgicalHistory = convertHistoryEntryDates(
          updateData.medicalHistory.surgicalHistory
        );
      }
      if (updateData.medicalHistory.medications) {
        updateData.medicalHistory.medications = convertHistoryEntryDates(
          updateData.medicalHistory.medications
        );
      }
    }

    // Convert other date fields if present
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.registrationDate) {
      updateData.registrationDate = new Date(updateData.registrationDate);
    }

    // Update the patient
    const patient = await Patient.findOneAndUpdate(
      { serialNumber: req.params.serialNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Serial number already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message,
    });
  }
});

// Note: GET /api/patients (list all) is handled in server.js
// This router handles individual patient operations

/**
 * POST /api/patient/:serialNumber/scan
 * Record a scanner event for a patient
 */
router.post('/:serialNumber/scan', async (req, res) => {
  try {
    // Verify patient exists
    const patient = await Patient.findOne({
      serialNumber: req.params.serialNumber,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Create scanner event
    const scannerEventData = {
      serialNumber: req.params.serialNumber,
      scannerName: req.body.scannerName || null,
      organization: req.body.organization || null,
      scannerPhone: req.body.scannerPhone || null,
      location: req.body.location || null,
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
      facialImage: req.body.facialImage || null,
      metadata: req.body.metadata || {},
    };

    const scannerEvent = await ScannerEvent.create(scannerEventData);

    res.status(201).json({
      success: true,
      message: 'Scanner event recorded successfully',
      data: scannerEvent,
      patient: {
        serialNumber: patient.serialNumber,
        fullName: patient.fullName,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to record scanner event',
      error: error.message,
    });
  }
});

module.exports = router;

