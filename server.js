// server.js (pastikan seperti ini)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000; // Render akan menyediakan PORT

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Melayani index.html dari root

// Endpoint /health untuk uptime monitoring
app.get('/health', (_req, res) => {
    res.status(200).send('OK');
});

// Endpoint /submit-match Anda
app.post('/submit-match', async (req, res) => {
    const { level } = req.body;

    // PENTING: Gunakan Render Environment Variables (Secrets) untuk AUTH_TOKEN!
    const AUTH_TOKEN = process.env.CRYPTALIA_AUTH_TOKEN;
    const TRIAL_ID = process.env.CRYPTALIA_TRIAL_ID || 'de8af613-7bb2-4fe4-a20f-19ddde2e82c1';
    const USER_ID = process.env.CRYPTALIA_USER_ID || '0c7e2da9-7c6b-4e3f-8879-3ad90e82d286';
    const HEROES = ["yaelie", "tsydora", "luro"]; // Ini juga bisa jadi env var

    try {
        const startRes = await fetch('https://api-loyalty.cryptalia.quest/api/v1/trials/level/start', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'authorization': `Bearer ${AUTH_TOKEN}`,
                'content-type': 'application/json',
                'origin': 'https://battle.cryptalia.quest',
                'referer': 'https://battle.cryptalia.quest/',
            },
            body: JSON.stringify({
                level: Number(level),
                heroes: HEROES,
                trialId: TRIAL_ID,
                userId: USER_ID,
            })
        });

        if (!startRes.ok) {
            const text = await startRes.text();
            console.error('Start request failed:', text);
            throw new Error(`Start request failed: ${text}`);
        }

        const startData = await startRes.json();
        const matchId = startData.matchId;

        const completeRes = await fetch('https://api-loyalty.cryptalia.quest/api/v1/trials/level/complete', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'content-type': 'application/json',
                'origin': 'https://battle.cryptalia.quest',
                'referer': 'https://battle.cryptalia.quest/',
            },
            body: JSON.stringify({
                matchId,
                result: 'win'
            })
        });

        if (!completeRes.ok) {
            const text = await completeRes.text();
            console.error('Complete request failed:', text);
            throw new Error(`Complete request failed: ${text}`);
        }

        const completeData = await completeRes.json();
        res.status(200).json({ matchId, complete: completeData });

    } catch (error) {
        console.error('Error during submit-match:', error);
        res.status(500).json({ error: 'Failed to submit match', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
