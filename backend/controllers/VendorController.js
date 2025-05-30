const CommunicationLogModel = require('../models/CommunicationLogModel');
const axios = require('axios');
const { redisClient } = require('../config/redisClient');




const SimulateDelivery = async (req, res) => {
    const { campaignId, customerName, customerEmail, message } = req.body;

    if (!campaignId || !customerName || !customerEmail || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const issent = Math.random() < 0.9;
    const status = issent ? 'sent' : 'failed';
    await axios.post('http://localhost:3000/api/vendor/delivery-response', {
        campaignId,
        customerName,
        customerEmail,
        status
    })
    return res.status(200).json({
        message: 'Delivery simulated successfully',
        status: status
    });
}



const deliveryResponse = async (req, res) => {
    const { campaignId, customerName, customerEmail, status } = req.body;

    if (!campaignId || !customerName || !customerEmail || !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const logEntry = {
            campaignId,
            customerName,
            customerEmail,
            status,
            createdAt: new Date()
        };

        await redisClient.lPush(`delivery_queue`, JSON.stringify(logEntry));
        res.status(201).json({ message: 'Delivery response logged successfully' });
    } catch (error) {
        console.error('Error logging delivery response:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    SimulateDelivery,
    deliveryResponse
};