// server.js
const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// ----- Middleware -----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Session -----
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaut_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // mettre true si HTTPS
}));

// ----- PostgreSQL Pool -----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // requis sur Render
});

// Exemple de route pour tester la DB
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur base de données');
  }
});

// ----- Routes statiques (si nécessaire) -----
app.use(express.static(path.join(__dirname, 'public')));

// ----- Port dynamique -----
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Application en écoute sur le port ${PORT}`);
});
