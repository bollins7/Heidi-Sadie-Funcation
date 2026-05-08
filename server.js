const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'survey-responses.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS survey_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_name TEXT,
            favorite_friend TEXT NOT NULL,
            personality TEXT NOT NULL,
            behavior TEXT NOT NULL,
            story TEXT,
            rating INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/survey', (req, res) => {
    const {
        visitorName = '',
        favoriteFriend,
        personality,
        behavior,
        story = '',
        rating
    } = req.body;

    const parsedRating = Number(rating);

    if (!favoriteFriend || !personality || !behavior || !Number.isInteger(parsedRating)) {
        return res.status(400).json({
            error: 'Favorite friend, personality, behavior, and rating are required.'
        });
    }

    if (parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const insertSurvey = `
        INSERT INTO survey_responses (
            visitor_name,
            favorite_friend,
            personality,
            behavior,
            story,
            rating
        ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        insertSurvey,
        [visitorName.trim(), favoriteFriend, personality, behavior, story.trim(), parsedRating],
        function handleInsert(error) {
            if (error) {
                return res.status(500).json({ error: 'Could not save survey response.' });
            }

            return res.status(201).json({ id: this.lastID, message: 'Survey response saved.' });
        }
    );
});

app.get('/api/survey', (_req, res) => {
    db.all(
        'SELECT * FROM survey_responses ORDER BY created_at DESC',
        (error, rows) => {
            if (error) {
                return res.status(500).json({ error: 'Could not load survey responses.' });
            }

            return res.json(rows);
        }
    );
});

app.listen(PORT, () => {
    console.log(`Heidi and Sadie site running at http://localhost:${PORT}`);
});
