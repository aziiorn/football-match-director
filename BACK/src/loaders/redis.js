const Redis = require('ioredis');

let redisClient;

const initRedis = () => {
    redisClient = new Redis({
        host: '127.0.0.1',
        port: 6379,
    });

    redisClient.on('connect', () => {
        console.log('[Redis] Connected successfully');
    });

    redisClient.on('error', (err) => {
        console.error('[Redis] Connection error:', err);
    });

    return redisClient;
};


const getClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized.');
    }
    return redisClient;
};

module.exports = {
    initRedis,
    getClient,
};