const http = require('http');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TIMEOUT = 60 * 1000;

(async () => {
    const start = Date.now();
    while (true) {
        console.log('⏳ Attente du frontend sur http://localhost:4200...');
        if (Date.now() - start > TIMEOUT) {
            console.log('⛔ Timeout : frontend non prêt après 60s');
            process.exit(1);
        }
        try {
            http.get('http://localhost:4200', (res) => {
                if (res.statusCode === 200 || res.statusCode === 302) {
                    console.log(`✅ Frontend Angular prêt (code ${res.statusCode})`);
                    process.exit(0);
                } else {
                    console.log('⚠️ Réponse HTTP :', res.statusCode);
                }
            }).on('error', (err) => {
                console.log('❌ Front non prêt :', err.message);
            });
        } catch (e) {
            console.log('❌ Erreur lors de la requête front :', e.message);
        }
        await delay(5000);
    }
})();