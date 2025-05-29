const CampaignModel = require('../models/CampaignModel');
const CustomerModel = require('../models/CustomerModel');
const axios = require('axios');


const createCampaign = async (req, res) => {
    const { name, description, rules, message } = req.body;

    if (!name || !description || !rules || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const campaign = new CampaignModel({
            uid: req.user._id,
            name,
            description,
            rules,
            message
        });

        await campaign.save();

        // Fetch matched customers based on rules
        const matchedCustomers = await CustomerModel.find(rules);

        // Simulate sending messages to matched customers
        for (const customer of matchedCustomers) {
            await axios.post('http://localhost:3000/api/vendor/send', {
                campaignId: campaign._id,
                customerName: customer.name,
                customerEmail: customer.email,
                message:message.replace('{name}', customer.name)
            });
        }

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


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