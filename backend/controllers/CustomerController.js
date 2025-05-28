const CustomerModel = require('../models/CustomerModel');


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
    const { name, email, phone,total_spent,visits,last_order_date } = req.body;
    try {
        if (!name || !email || !phone || !total_spent || !visits || !last_order_date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const customer = await CustomerModel.create({
            name,
            email,
            phone,
            total_spent,
            visits,
            last_order_date,
            uid: req.user._id 
        });
        res.status(201).json(customer);

    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(400).json({ error: 'Bad request' });
    }
}

// add multiple customers simultaneously
const createMultipleCustomers = async (req, res) => {
    const customersData = req.body.customers; 
    try {
        if (!Array.isArray(customersData) || customersData.length === 0) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const customers = await CustomerModel.insertMany(
            customersData.map(customer => ({
                ...customer,
                uid: req.user._id 
            }))
        );
        res.status(201).json(customers);
    } catch (error) {
        console.error('Error creating multiple customers:', error);
        res.status(400).json({ error: 'Bad request' });
    }
}

// delete a customer by array of ids
const deleteCustomers = async (req, res) => {
    const { ids } = req.body; 
    console.log('Deleting customers with IDs:', ids);
    
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