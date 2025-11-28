const mongoose = require('mongoose');

const scannerEventSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
      ref: 'Patient',
    },
    scannerName: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    scannerPhone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    facialImage: {
      type: String, // Placeholder - could be a URL, base64, or path to stored image
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // For additional scanner-specific data
    },
  },
  { timestamps: true }
);

// Index for efficient queries by serialNumber and timestamp
scannerEventSchema.index({ serialNumber: 1, timestamp: -1 });

module.exports = mongoose.model('ScannerEvent', scannerEventSchema);

