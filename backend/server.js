require('dotenv').config();
const express = require('express');
const mongoose=require('mongoose');
const app = express();
const UserRoutes = require('./routes/user');


const port = 3000;

app.use(express.json());

app.use('/api/user', UserRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// connect to the database

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to the database");
}).catch((error) => {
    console.log("error ", error);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});