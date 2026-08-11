const Surgery = require('../models/Surgery');

exports.getAll = async (req, res) => {
  try {
    const data = await Surgery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Surgery.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Surgery not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Surgery.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Surgery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) {
      return res.status(404).json({ success: false, message: 'Surgery not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await Surgery.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Surgery not found' });
    }
    res.status(200).json({ success: true, message: 'Surgery deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
