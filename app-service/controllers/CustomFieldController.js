const CustomField = require('../models/CustomFieldModel');

const getCustomFields = async (req, res) => {
  try {
    const doc = await CustomField.findOne({ uid: req.user._id });
    res.json(doc ? doc.fields : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch custom fields' });
  }
};

const createCustomField = async (req, res) => {
  try {
    const { fields } = req.body;
    const doc = new CustomField({ uid: req.user._id, fields });
    await doc.save();
    res.status(201).json(doc.fields);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create custom fields' });
  }
};

const updateCustomField = async (req, res) => {
  try {
    const { fields } = req.body;
    const doc = await CustomField.findOneAndUpdate(
      { uid: req.user._id },
      { fields },
      { new: true, upsert: true }
    );
    res.json(doc.fields);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update custom fields' });
  }
};

module.exports = {
  getCustomFields,
  createCustomField,
  updateCustomField
};