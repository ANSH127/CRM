const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    total_spent: {
        type: Number,
        default: 0,
    },
    visits: {
        type: Number,
        default: 0,
    },
    last_order_date: {
        type: Date,
        default: Date.now,
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    customFields: { type: Object, default: {} },

}, {
    timestamps: true,
});

customerSchema.index({ email: 1, uid: 1 }, { unique: true });
const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;