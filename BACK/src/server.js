const sequelize = require('./loaders/mysql');
const { initRedis } = require('./loaders/redis');
const app = require('./app');
const { subscribeToGoalEvents } = require('./subscribers/goalSubscriber');
const { subscribeToPlayerEvents } = require('./subscribers/playerInjuries');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});


const PORT = 8080;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');

        initRedis();
        subscribeToGoalEvents(io);
        subscribeToPlayerEvents();

        server.listen(PORT, () => {
            console.log('Serveur démarré sur http://localhost:8080');
            console.log('Frontend démarré sur http://localhost:4200');
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

sequelize.sync()
    .then(() => console.log('TABLES ARE SYNCHRONIZED'))
    .catch(err => console.error('Error', err));

startServer();