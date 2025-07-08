require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const CustomerRoutes = require('./routes/customer');
const CampaignRoutes = require('./routes/campaign');
const VendorRoutes = require('./routes/vendor');
const UserAnalyticsRoutes = require('./routes/useranalytics');
const { connectRedis } = require('./config/redisClient');
const { processBatch } = require('./workers/batchWorker');
const { processCustomerStream } = require('./workers/customerStream');
const customFieldRoutes = require('./routes/customfield');

const port = process.env.PORT || 3002;

app.use(cors({ origin: '*'}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api/customer', CustomerRoutes);
app.use('/api/campaign', CampaignRoutes);
app.use('/api/vendor', VendorRoutes);
app.use('/api/customfield', customFieldRoutes);
app.use('/api/useranalytics', UserAnalyticsRoutes);
app.get('/health', (req, res) => {
  res.send('OK');
});



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