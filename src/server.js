const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const pagesRoutes = require('./routes/pages.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = 3000;

// EJS + chemin des vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globaux
app.use(express.urlencoded({ extended: false })); // pour lire req.body des formulaires
app.use(express.json());
app.use(cookieParser());

// Fichiers statiques (CSS, images…)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', pagesRoutes);
app.use('/', authRoutes);

// 404 simple
app.use((req, res) => res.status(404).send('Page introuvable'));

// Démarrage
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
