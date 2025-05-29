const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rules: {
        type: Object,
        required: true,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    uid: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message:{
        type:String,
        required:true

    },
    matchedCustomersCount: {
        type: Number,
        default: 0
    }
})

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;







