# Heidi-Sadie-Funcation

A modern little website for Heidi and Sadie with a visitor survey backed by SQLite.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Survey backend

Survey submissions are posted to `POST /api/survey` and stored in a local SQLite database named `survey-responses.db`. You can read saved responses from `GET /api/survey`.
