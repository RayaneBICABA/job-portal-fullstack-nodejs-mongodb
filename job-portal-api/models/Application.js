const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  canditate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Canditate",
    required: [true, "The candidate is reuqired"],
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: [true, "The job is required"],
  },

  coverLetter: {
    type: String,
    required: [true, "The cover letter is required"],
    trim: true,
    length: 5000,
  },

  status: {
    type: String,
    enum: ["pending", "reviewed", "rejected"],
    default: "pending",
    required: [true, "The status is required"],
    trim: true,
  },

  appliedAt: {
    type: Date,
    default: Date.now,
    required: [true, "The date is required"],
  },
});

module.exports = mongoose.model("Application", applicationSchema);
