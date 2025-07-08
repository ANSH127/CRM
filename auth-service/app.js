require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const UserRoutes = require('./routes/user');

const port = process.env.PORT || 3001;

app.use(cors({ origin: '*'}));
app.use(express.json());
app.use('/api/user', UserRoutes);



// connect to the database
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
