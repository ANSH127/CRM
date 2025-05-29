const UserModel = require('../models/UserModel');
const CustomerModel = require('../models/CustomerModel');
const CampaignModel = require('../models/CampaignModel');


const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email: user.email, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email: user.email, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const googleLogin = async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: 'Google credential is required' });
    }
    try {
        const ticket= await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { name, email } = payload;
        let user = await UserModel.find({ email });
        if (user.length === 0) {
            user = await UserModel.create({ name, email, authProvider: 'google' });
        } else {
            user = user[0];
        }
        const token = createToken(user._id);
        res.status(200).json({ name: user.name, email: user.email, token });
        
    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ error: 'Google login failed' });
        
    }
}


const getUserAnalytics = async (req, res) => {
    const userId = req.user._id;
    try {
        const customerCount = await CustomerModel.countDocuments({ uid:userId });
        const campaignCount = await CampaignModel.countDocuments({uid:userId });
        const lastCampaign = await CampaignModel.findOne({ uid: userId }).sort({ createdAt: -1 });
        res.status(200).json({ customerCount, campaignCount, lastCampaign });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login,
    googleLogin,
    getUserAnalytics
};



