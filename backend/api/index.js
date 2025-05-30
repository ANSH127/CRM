require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserRoutes = require('../routes/user');
const CustomerRoutes = require('../routes/customer');
const CampaignRoutes = require('../routes/campaign');
const VendorRoutes = require('../routes/vendor');
const { connectRedis } = require('../config/redisClient');
const { processBatch } = require('../workers/batchWorker');
const { processCustomerStream } = require('../workers/customerStream');

const port = process.env.PORT || 3000;

app.use(cors({ origin: '*'}));

app.use(express.json());

app.use('/api/user', UserRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/campaign', CampaignRoutes);
app.use('/api/vendor', VendorRoutes);


// connect to the database


(async () => {
    try {
        await connectRedis();
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Redis and MongoDB");
        processCustomerStream();
        processBatch();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}
)();


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app; 