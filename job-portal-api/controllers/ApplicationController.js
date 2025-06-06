const Application = require("../models/Application");

exports.applyToJob = async (req, res) => {
  const { candidate, job, coverLetter } = req.body;
  try {
    const newApplication = await Application.create({
      candidate,
      job,
      coverLetter,
    });
    const savedApplication = await newApplication.save();
    res.status(201).json({
      message: "Application created successfully",
      application: savedApplication,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    }).populate("job");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    }).populate("candidate");
    if (applications.length === 0)
      return res.status(404).json({ message: "No applications found" });
    res.status(200).json({
      message: "Applications found",
      applications,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({
      message: "Application status update with success",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
