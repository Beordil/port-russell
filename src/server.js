const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Import des routes
const pagesRoutes = require('./routes/pages.routes');
const authRoutes = require('./routes/auth.routes');
const catwaysRoutes = require('./routes/catways.routes');
const reservationsRoutes = require('./routes/reservations.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- EJS + Vues -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----- Middlewares globaux -----
app.use(express.urlencoded({ extended: false })); // lecture des formulaires
app.use(express.json());                          // lecture JSON
app.use(cookieParser());                          // cookies

// ----- Fichiers statiques -----
app.use(express.static(path.join(__dirname, 'public')));

// ----- Routes -----
app.use('/', pagesRoutes);
app.use('/', authRoutes);
app.use('/api', catwaysRoutes);
app.use('/api', reservationsRoutes);

// ----- 404 -----
app.use((req, res) => res.status(404).send('Page introuvable'));

// ----- Connexion DB + lancement serveur -----
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ MongoDB connecté');
      console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });
