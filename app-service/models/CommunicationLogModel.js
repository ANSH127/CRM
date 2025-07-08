const mongoose = require('mongoose');
const communicationLogSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'failed', ],
        default: 'sent'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);
module.exports = CommunicationLog;