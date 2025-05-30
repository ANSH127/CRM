const { redisClient } = require('../config/redisClient');
const CustomerModel = require('../models/CustomerModel');

const processCustomerStream = async () => {
    try {
        // clear the previous customer data
        const streamName = 'customer_stream';
        let lastId = await redisClient.get('last_customer_id') || '0-0';

        while (true) {

            const entries = await redisClient.xRead({ key: streamName, id: lastId }, { count: 10, block: 0 });


            if (entries && entries.length > 0) {
                for (const st of entries) {
                    for (const msg of st.messages) {
                        const id = msg.id;
                        const fields = msg.message;

                        let customerData = {};
                        const keys = Object.keys(fields);
                        for (let i = 0; i < keys.length; i += 2) {
                            const field = fields[i];
                            const value = fields[i + 1];
                            customerData[field] = value;
                        }
                        try {
                            await CustomerModel.create(customerData);
                            console.log(`Customer created with ID: ${id}`);
                        } catch (err) {
                            if (err.code === 11000) {
                                await CustomerModel.findOneAndUpdate(
                                    { email: customerData.email, uid: customerData.uid },
                                    { $set: customerData },
                                    { new: true }
                                );
                                console.log(`Customer with email: ${customerData.email} and uid: ${customerData.uid} updated for ID: ${id}`);
                            } else {
                                console.error(`Error creating customer for ID: ${id}`, err);
                            }
                        }
                        lastId = id;
                        await redisClient.set('last_customer_id', lastId);
                        await redisClient.xDel(streamName, id);

                    }
                }
            }
        }
    } catch (error) {
        console.error('Error processing customer stream:', error);
    }
}
module.exports = { processCustomerStream };