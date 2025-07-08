const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDDIS_PASSWORD,
    socket: {
        host: 'redis-14600.c91.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 14600
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }

}
module.exports = { redisClient, connectRedis };