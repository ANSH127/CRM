const CampaignModel = require('../models/CampaignModel');
const CustomerModel = require('../models/CustomerModel');


const createCampaign = async (req, res) => {
}


const getMatchedCustomersCount = async (req, res) => {
    const { rules } = req.body;
    try {
        const customers = await CustomerModel.find(rules);
        res.status(200).json({ count: customers.length });
    } catch (error) {
        console.error('Error fetching matched customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getCampaigns = async (req, res) => {
    try {
        const campaigns = await CampaignModel.find({ uid: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createCampaign,
    getMatchedCustomersCount,
    getCampaigns
};