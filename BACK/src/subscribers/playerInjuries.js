const { getClient } = require('../loaders/redis');

const subscribeToPlayerEvents = () => {
    const redisSub = getClient().duplicate();

    redisSub.on('connect', () => {
        console.log('[Subscriber] Connected to Redis for player events');

        redisSub.subscribe('player:injured', 'player:recovered', (err, count) => {
            if (err) {
                console.error('[Subscriber] Failed to subscribe:', err);
                return;
            }
            console.log(`[Subscriber] Subscribed to ${count} player event(s)`);
        });
    });

    redisSub.on('message', (channel, message) => {
        const data = JSON.parse(message);

        if (channel === 'player:injured') {
            console.log(`[Subscriber] Player ${data.playerId} is now injured.`);
        } else if (channel === 'player:recovered') {
            console.log(`[Subscriber] Player ${data.playerId} has recovered.`);
        }
    });
};

module.exports = { subscribeToPlayerEvents };