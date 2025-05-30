const { redisClient } = require('../config/redisClient');
const CommunicationLogModel = require('../models/CommunicationLogModel');

const BATCH_SIZE = 50;
const INTERVAL = 5000; // 5 seconds

const processBatch = async () => {

    setInterval(async () => {
        try {
            const batch = [];
            for (let i = 0; i < BATCH_SIZE; i++) {
                const log = await redisClient.rPop('delivery_queue');
                if (log) {
                    batch.push(JSON.parse(log));
                } else {
                    break;
                }
            }
            if (batch.length > 0) {
                await CommunicationLogModel.insertMany(batch);
                console.log(`Processed batch of ${batch.length} logs`);
            } else {
                console.log('No logs to process');
            }
        } catch (error) {
            console.error('Error processing batch:', error);
        }
    }, INTERVAL);

}

module.exports = { processBatch };