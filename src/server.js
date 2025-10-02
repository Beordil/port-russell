require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./config/db');            // <— connexion Mongo
const pagesRoutes = require('./routes/pages.routes');
const authRoutes = require('./routes/auth.routes');
const catwaysRoutes = require('./routes/catways.routes'); // <— routes API

const app = express();
const PORT = process.env.PORT || 3000;

// EJS + vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globaux
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Statique
app.use(express.static(path.join(__dirname, 'public')));

// Pages HTML
app.use('/', pagesRoutes);
app.use('/', authRoutes);

// API JSON
app.use('/api', catwaysRoutes); // => /api/catways, /api/catways/:id

// 404 simple
app.use((req, res) => res.status(404).send('Page introuvable'));

// Démarrage APRÈS connexion DB
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ Erreur MongoDB :', e.message);
    process.exit(1);
  });
