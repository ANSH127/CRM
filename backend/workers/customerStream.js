const { redisClient } = require('../config/redisClient');
const CustomerModel = require('../models/CustomerModel');

const BATCH_SIZE = 20; 

const processCustomerStream = async () => {
    try {
        const streamName = 'customer_stream';
        let lastId = await redisClient.get('last_customer_id') || '0-0';
        let batch = [];
        let batchIds = [];

        while (true) {
            const entries = await redisClient.xRead({ key: streamName, id: lastId }, { count: 20, block: 0 });

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
                        batch.push(customerData);
                        batchIds.push(id);

                        if (batch.length >= BATCH_SIZE) {
                            await insertBatch(batch);
                            for (const delId of batchIds) {
                                await redisClient.xDel(streamName, delId);
                            }
                            batch = [];
                            batchIds = [];
                        }
                        lastId = id;
                    }
                }
                if (batch.length > 0) {
                    await insertBatch(batch);
                    for (const delId of batchIds) {
                        await redisClient.xDel(streamName, delId);
                    }
                    batch = [];
                    batchIds = [];
                }
                await redisClient.set('last_customer_id', lastId);
            }
        }
    } catch (error) {
        console.error('Error processing customer stream:', error);
    }
};

async function insertBatch(batch) {
    try {
        await CustomerModel.insertMany(batch, { ordered: false });
        console.log(`Batch inserted: ${batch.length} customers`);
    } catch (err) {
        if (err.code === 11000 || err.writeErrors) {
            console.warn('Duplicate key error(s) occurred. Skipping duplicates.');
        } else {
            console.error('Error inserting batch:', err);
        }
    }
}

module.exports = { processCustomerStream };