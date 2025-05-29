require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserRoutes = require('./routes/user');
const CustomerRoutes = require('./routes/customer');
const CampaignRoutes = require('./routes/campaign');


const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use('/api/user', UserRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/campaign', CampaignRoutes);


// connect to the database

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to the database");
}).catch((error) => {
    console.log("error ", error);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});