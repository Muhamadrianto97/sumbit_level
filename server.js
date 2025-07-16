const express = require('express');
// Jika Node v18+, fetch sudah tersedia, kalau tidak pakai: const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-match', async (req, res) => {
  const { level } = req.body;

  try {
    // Start request
    const startRes = await fetch('https://api-loyalty.cryptalia.quest/api/v1/trials/level/start', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNhYVl5dGR3d2UwMzJzMXIzVElyOSJ9.eyJlbWFpbCI6Im1yaWFudG80NTZAZ21haWwuY29tIiwiY2xpZW50X25hbWUiOiJFY2hvZXMgb2YgQ3J5cHRhbGlhIiwiY2xpZW50X3R5cGUiOiJzcGEiLCJjbGllbnRfb3JnIjoiNTM1NDBjZTUtZDU3Ni00YjUyLTg2YTUtOTg5M2MwMTNhMjQ1IiwiZXRoZXJfa2V5IjoiMHg3MmUwNzljNTE2YzgwYWMyNzM2ZTEyZDdiZmQwMWM5OTAzYWEyODg3Iiwic3Rhcmtfa2V5IjoiMHgwNDIyYWQxMmM5NGRjYjQ3NmZhNDM1NzkyOGEyYjE3NjljNzYyZWZmN2VlYTlmOGEzNjhiZDVmZWMwZWRlNzkxIiwidXNlcl9hZG1pbl9rZXkiOiIweDdjNmRjN2IzOGU3YTFjNjVhZGFmYzg2Y2VhMTdmY2VhMGNkOGEzYjIiLCJpbXhfZXRoX2FkZHJlc3MiOiIweDcyZTA3OWM1MTZjODBhYzI3MzZlMTJkN2JmZDAxYzk5MDNhYTI4ODciLCJpbXhfc3RhcmtfYWRkcmVzcyI6IjB4MDQyMmFkMTJjOTRkY2I0NzZmYTQzNTc5MjhhMmIxNzY5Yzc2MmVmZjdlZWE5ZjhhMzY4YmQ1ZmVjMGVkZTc5MSIsImlteF91c2VyX2FkbWluX2FkZHJlc3MiOiIweDdjNmRjN2IzOGU3YTFjNjVhZGFmYzg2Y2VhMTdmY2VhMGNkOGEzYjIiLCJ6a2V2bV9ldGhfYWRkcmVzcyI6IjB4NzJlMDc5YzUxNmM4MGFjMjczNmUxMmQ3YmZkMDFjOTkwM2FhMjg4NyIsInprZXZtX3VzZXJfYWRtaW5fYWRkcmVzcyI6IjB4N2M2ZGM3YjM4ZTdhMWM2NWFkYWZjODZjZWExN2ZjZWEwY2Q4YTNiMiIsImlzcyI6Imh0dHBzOi8vYXV0aC5pbW11dGFibGUuY29tLyIsInN1YiI6ImVtYWlsfDY2MzY0M2U2NWEwNTVjY2JlZDZiNTQyNSIsImF1ZCI6WyJwbGF0Zm9ybV9hcGkiLCJodHRwczovL3Byb2QuaW1tdXRhYmxlLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3NTExNzE0MjQsImV4cCI6MTc1MTE3MjMyNCwic2NvcGUiOiJvcGVuaWQgZW1haWwgdHJhbnNhY3Qgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJ0a3hwenpFcHBhRFRxMExLMUN4dm16NFJSN2c3dmFMciJ9.i_E-XJP1051CbXC1oZlJ-Hkboo_esbksmGydpSgjVD4NEp3nrJpbbGAl1QxCtbsWDKUiUgKY8rbJA0P6EYDv3QOa9xUhiGddye5Ne9C2pTTcMWs4nt1ddzX661wGQ2QWDZ4TGehczIUBQOVyqsgVWKIPblfFfHG72v9TUy-eiPvyG5wKMNcn4Y_8UQgNHVMyW64ppM2ZPlBMqi6ffGrYuFrZAoLf9QjG4tvRoHK4eYHJQEH-i_DXsarOgr7wIjX0L-5m7iZjEz3YKg00xqJBRvLrOR8XoBH0g_1nRl9hzYwFUxOzsBfxlv3zRRvWkFCA5hd5mnhoCDP7rnGa67Vswg',
        'content-type': 'application/json',
        'origin': 'https://battle.cryptalia.quest',
        'referer': 'https://battle.cryptalia.quest/',
      },
      body: JSON.stringify({
        level : Number(level),
        heroes: ["yaelie","tsydora","luro"],
        trialId: 'de8af613-7bb2-4fe4-a20f-19ddde2e82c1',
        userId: '0c7e2da9-7c6b-4e3f-8879-3ad90e82d286',
      })
    });

    if (!startRes.ok) {
      const text = await startRes.text();
      console.error('Start request failed:', text);
      throw new Error(`Start request failed: ${text}`);
    }
    

    const startData = await startRes.json();
    const matchId = startData.matchId;

    // Complete request
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
  console.log(`Server is running at http://localhost:${PORT}`);
});

