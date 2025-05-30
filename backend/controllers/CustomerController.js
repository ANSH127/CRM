const CustomerModel = require('../models/CustomerModel');
const xlsx = require('xlsx');
const fs = require('fs');
const { redisClient } = require('../config/redisClient');


// get all customers for a user
const getCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.find({ uid: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// create a new customer one
const createCustomer = async (req, res) => {
    const { name, email, phone, total_spent, visits, last_order_date } = req.body;
    try {
        if (!name || !email || !phone || !total_spent || !visits || !last_order_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const customer = {
            name,
            email,
            phone,
            total_spent,
            visits,
            last_order_date,
            uid: req.user._id.toString()
        }
        // clear the previous customer data
        const customerFields = Object.entries(customer).flat();
        await redisClient.xAdd('customer_stream', '*', customerFields);
        res.status(201).json({ message: 'Customer created successfully', customer });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ error: 'Bad request' });
    }
}

function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
}

// add multiple customers simultaneously
const createMultipleCustomers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        let customerdata;
        try {
            customerdata = data.map(customer => ({
                name: customer.name,
                email: customer.email,
                phone: customer.phone ? customer.phone.toString() : "",
                total_spent: customer.total_spent.toString(),
                visits: customer.visits.toString(),
                last_order_date: excelDateToJSDate(customer.last_order_date),
                uid: req.user._id.toString()
            }));
            // console.log(customerdata);
            

        } catch (error) {
            console.error('Error processing customer data:', error);
            return res.status(400).json({ error: 'Invalid data format in the file' });

        }

        if (customerdata.length === 0) {
            return res.status(400).json({ error: 'No valid customer data found in the file' });
        }

        // Push each customer to the stream
        for (const customer of customerdata) {
            const customerFields = Object.entries(customer).flat();
            await redisClient.xAdd('customer_stream', '*', customerFields);
        }

        // const customers = await CustomerModel.insertMany(customerdata);
        res.status(201).json({ message: 'Customers created successfully' });

    } catch (error) {
        console.error('Error creating multiple customers:', error);
        res.status(400).json({ error: ' Error creating customers' });
    }
    finally {
        fs.unlinkSync(req.file.path);

    }
}

// delete a customer by array of ids
const deleteCustomers = async (req, res) => {
    const { ids } = req.body;
    // console.log('Deleting customers with IDs:', ids);

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    try {
        const result = await CustomerModel.deleteMany({
            _id: { $in: ids },
            uid: req.user._id
        });
        res.status(200).json({ message: 'Customers deleted successfully', result });
    } catch (error) {
        console.error('Error deleting customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getCustomers,
    createCustomer,
    createMultipleCustomers,
    deleteCustomers
};