// ============================================================================
// 🌊 Port Russell — Server.js
// FR : Point d’entrée principal du serveur Express (API + UI)
// EN : Main entry point for the Express server (API + UI)
// ============================================================================

// -----------------------------------------------------------------------------
// 🧩 Core modules / Modules de base
// -----------------------------------------------------------------------------
const path = require('path');             // FR : Gestion des chemins | EN : Path utilities
const express = require('express');       // FR : Framework HTTP principal | EN : Core HTTP framework
const cookieParser = require('cookie-parser'); // FR : Lecture/écriture des cookies | EN : Cookie parsing
require('dotenv').config();               // FR : Chargement des variables d’environnement | EN : Load .env config

// -----------------------------------------------------------------------------
// 💾 Database / Base de données
// -----------------------------------------------------------------------------
const { connectDB } = require('./config/db'); // FR : Connexion MongoDB | EN : MongoDB connection

// -----------------------------------------------------------------------------
// 🚏 Routes / Endpoints declarations
// -----------------------------------------------------------------------------
const pagesRoutes          = require('./routes/pages.routes');          // FR : Accueil + tableau de bord | EN : Home + dashboard
const authRoutes           = require('./routes/auth.routes');           // FR : Authentification | EN : Authentication
const catwaysRoutes        = require('./routes/catways.routes');        // FR : API CRUD catways | EN : Catways REST API
const reservationsRoutes   = require('./routes/reservations.routes');   // FR : API CRUD réservations | EN : Reservations REST API
const usersRoutes          = require('./routes/users.routes');          // FR : API CRUD utilisateurs | EN : Users REST API

// Interfaces UI (EJS front)
const usersUiRoutes        = require('./routes/users.ui.routes');        // FR : UI utilisateurs | EN : Users UI
const catwaysUiRoutes      = require('./routes/catways.ui.routes');      // FR : UI catways | EN : Catways UI
const reservationsUiRoutes = require('./routes/reservations.ui.routes'); // FR : UI réservations | EN : Reservations UI

// -----------------------------------------------------------------------------
// 📚 Swagger (Documentation API)
// -----------------------------------------------------------------------------
const swaggerUi = require('swagger-ui-express');
const { openapiSpec } = require('./config/swagger'); // FR : Spécification OpenAPI | EN : OpenAPI specification

// -----------------------------------------------------------------------------
// 🚀 Application Express
// -----------------------------------------------------------------------------
const app  = express();
const PORT = process.env.PORT || 3000;

// FR : Indique à Express qu’il tourne derrière un proxy (Render, Nginx, etc.)
// EN : Tells Express it runs behind a reverse proxy (Render, Nginx, etc.)
app.set('trust proxy', 1);

// -----------------------------------------------------------------------------
// 🎨 View engine (EJS templates)
// -----------------------------------------------------------------------------
app.set('view engine', 'ejs');                    // FR : Moteur de rendu | EN : Template engine
app.set('views', path.join(__dirname, 'views'));  // FR : Dossier des vues | EN : Views directory

// -----------------------------------------------------------------------------
// ⚙️ Middlewares globaux
// -----------------------------------------------------------------------------
app.use(express.urlencoded({ extended: false })); // FR : Décodage des formulaires | EN : Parse URL-encoded forms
app.use(express.json());                          // FR : Décodage JSON | EN : Parse JSON payloads
app.use(cookieParser());                          // FR : Cookies client | EN : Client cookie handler

// FR : BASE_URL dynamique (utile sur Render ou local)
// EN : Dynamic BASE_URL (useful for local or Render environments)
app.use((req, res, next) => {
  const dynamicBase = `${req.protocol}://${req.get('host')}`;
  process.env.BASE_URL = process.env.BASE_URL || dynamicBase;
  res.locals.BASE_URL  = process.env.BASE_URL;
  next();
});

// -----------------------------------------------------------------------------
// 🧱 Fichiers statiques (CSS, images...)
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------------------------------
// 🧭 Déclaration des routes principales
// -----------------------------------------------------------------------------
app.use('/', pagesRoutes);            // FR : Page d’accueil + dashboard | EN : Home + dashboard
app.use('/', authRoutes);             // FR : Authentification | EN : Auth routes

// --- UI (EJS) ---
app.use('/', usersUiRoutes);          // FR : Interface utilisateurs | EN : Users UI
app.use('/', catwaysUiRoutes);        // FR : Interface catways | EN : Catways UI
app.use('/', reservationsUiRoutes);   // FR : Interface réservations | EN : Reservations UI

// --- API REST ---
app.use('/api', catwaysRoutes);       // FR : API Catways | EN : Catways API
app.use('/api', reservationsRoutes);  // FR : API Réservations | EN : Reservations API
app.use('/api', usersRoutes);         // FR : API Utilisateurs | EN : Users API

// --- Swagger Docs ---
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));

// -----------------------------------------------------------------------------
// ❤️ Health check (Render ping)
// -----------------------------------------------------------------------------
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

// -----------------------------------------------------------------------------
// 🚫 404 fallback
// -----------------------------------------------------------------------------
app.use((req, res) => res.status(404).send('Page introuvable / Page not found'));

// -----------------------------------------------------------------------------
// 🏁 Boot — Connexion MongoDB + démarrage du serveur
// -----------------------------------------------------------------------------
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      const base = process.env.BASE_URL || `http://localhost:${PORT}`;
      console.log('✅ MongoDB connecté / connected');
      console.log(`✅ Serveur démarré : ${base}`);
      console.log(`📚 Docs Swagger : ${base}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB / MongoDB error:', err.message);
    process.exit(1);
  });
