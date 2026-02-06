const { getClient } = require('../loaders/redis');

const subscribeToGoalEvents = (io) => {
    const redis = getClient().duplicate();

    redis.on('connect', () => {
        console.log('[Subscriber] Connected to Redis');
        redis.subscribe('match:goal', (err, count) => {
            if (err) {
                console.error('[Subscriber] Failed to subscribe:', err);
                return;
            }
            console.log(`[Subscriber] Subscribed to ${count} channel(s)`);
        });
    });

    redis.on('message', (channel, message) => {
        if (channel === 'match:goal') {
            const data = JSON.parse(message);
            console.log(`[Subscriber] Received message on channel ${channel}:`, data);
            console.log(`[Subscriber] ⚽ Goal scored! Match #${data.matchId}, Team: ${data.team}, Player: ${data.playerId}`);

            io.emit('goal', {
                matchId: data.matchId,
                teamId: data.team,
                playerId: data.playerId,
            });
        }
    });
};

module.exports = { subscribeToGoalEvents };
