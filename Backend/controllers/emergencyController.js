const Emergency = require('../models/EmergencyCase');

exports.getAll = async (req, res) => {
  try {
    const data = await Emergency.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Emergency.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Emergency.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Emergency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Emergency.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }
    res.status(200).json({ success: true, message: 'Emergency deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
