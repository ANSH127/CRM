const CampaignModel = require('../models/CampaignModel');
const CustomerModel = require('../models/CustomerModel');
const CommunicationLogModel = require('../models/CommunicationLogModel');
const axios = require('axios');


const createCampaign = async (req, res) => {
    const { name, description, rules, message,tag } = req.body;

    if (!name || !description || !rules || !message || !tag) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
         const filter = { $and: [rules, { uid: req.user._id }] };

        const matchedCustomers = await CustomerModel.find(filter);
        if (matchedCustomers.length === 0) {
            return res.status(404).json({ error: 'No customers matched the provided rules' });
        }

        const campaign = new CampaignModel({
            uid: req.user._id,
            name,
            description,
            rules,
            message,
            matchedCustomersCount: matchedCustomers.length,
            tag
        });

        await campaign.save();


        // Simulate sending messages to matched customers
        for (const customer of matchedCustomers) {
            await axios.post(`${process.env.API_URL}/api/vendor/send`, {
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
        const filter = { $and: [rules, { uid: req.user._id }] };

        const customers = await CustomerModel.find(filter);
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

const fetchCampaignsRecord = async (req, res) => {
    try {
        const campaignID = req.params.id;
        const campaign = await CampaignModel.findById(campaignID);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        if (campaign.uid.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized access to this campaign' });
        }
        // Fetch communication logs for the campaign
        const records = await CommunicationLogModel.find({ campaignId: campaignID }).sort({ createdAt: -1 });
        if (!records) {
            return res.status(404).json({ error: 'No records found for this campaign' });
        }
        res.status(200).json({records, campaign});
        
    } catch (error) {
        console.error('Error fetching campaign records:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}



module.exports = {
    createCampaign,
    getMatchedCustomersCount,
    getCampaigns,
    fetchCampaignsRecord
};