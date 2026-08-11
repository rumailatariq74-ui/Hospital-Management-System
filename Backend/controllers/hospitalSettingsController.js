const HospitalSettings = require('../models/HospitalSettings');

exports.getAll = async (req, res) => {
  try {
    const data = await HospitalSettings.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await HospitalSettings.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'HospitalSettings not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await HospitalSettings.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await HospitalSettings.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      return res.status(404).json({ success: false, message: 'HospitalSettings not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await HospitalSettings.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'HospitalSettings not found' });
    }
    res.status(200).json({ success: true, message: 'HospitalSettings deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
