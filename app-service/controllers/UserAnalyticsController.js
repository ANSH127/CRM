const CustomerModel = require('../models/CustomerModel');
const CampaignModel = require('../models/CampaignModel');
const CommunicationLogModel = require('../models/CommunicationLogModel');


const getUserAnalytics = async (req, res) => {
    const userId = req.user._id;
    try {
        const customerCount = await CustomerModel.countDocuments({ uid:userId });
        const campaignCount = await CampaignModel.countDocuments({uid:userId });
        if (campaignCount === 0) {
            return res.status(200).json({ customerCount, campaignCount, lastCampaign: null });
        }
        const lastCampaign = await CampaignModel.findOne({ uid: userId }).sort({ createdAt: -1 });

        const successfulcnt= await CommunicationLogModel.countDocuments({ campaignId: lastCampaign._id, status: 'sent' });
        res.status(200).json({ customerCount, campaignCount, lastCampaign,
            successfulcnt
         });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getUserAnalytics
};




