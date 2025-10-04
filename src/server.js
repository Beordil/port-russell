// -----------------------------------------------------------------------------
// FR : Modules de base
// EN : Core modules
// -----------------------------------------------------------------------------
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// -----------------------------------------------------------------------------
// FR : Connexion à MongoDB
// EN : MongoDB connection
// -----------------------------------------------------------------------------
const { connectDB } = require('./config/db');

// -----------------------------------------------------------------------------
// FR : Import des routes (pages UI + APIs + UI Users)
// EN : Import routes (pages UI + APIs + UI Users)
// -----------------------------------------------------------------------------
const pagesRoutes = require('./routes/pages.routes');
const authRoutes = require('./routes/auth.routes');
const catwaysRoutes = require('./routes/catways.routes');
const reservationsRoutes = require('./routes/reservations.routes');
const usersRoutes = require('./routes/users.routes');       // API Users
const usersUiRoutes = require('./routes/users.ui.routes');  // UI Users

// -----------------------------------------------------------------------------
// FR : Swagger (UI + spec générée)
// EN : Swagger (UI + generated spec)
// -----------------------------------------------------------------------------
const swaggerUi = require('swagger-ui-express');
const { openapiSpec } = require('./config/swagger');

// -----------------------------------------------------------------------------
// FR : Initialisation Express
// EN : Initialize Express
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (Render / reverse proxy)
app.set('trust proxy', 1);

// -----------------------------------------------------------------------------
// FR : Configuration EJS (templates)
// EN : EJS configuration (templates)
// -----------------------------------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// -----------------------------------------------------------------------------
// FR : Middlewares globaux
// EN : Global middlewares
// -----------------------------------------------------------------------------
app.use(express.urlencoded({ extended: false })); // forms
app.use(express.json());                          // JSON body
app.use(cookieParser());                          // cookies

// BASE_URL dynamique pour UI (et res.locals pour les vues)
app.use((req, res, next) => {
  const dynamicBase = `${req.protocol}://${req.get('host')}`;
  process.env.BASE_URL = process.env.BASE_URL || dynamicBase;
  res.locals.BASE_URL = process.env.BASE_URL;
  next();
});

// -----------------------------------------------------------------------------
// FR : Fichiers statiques
// EN : Static files
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------------------------------
// FR : Routes principales (ordre : pages/UI puis API)
// EN : Main routes (order: pages/UI then API)
// -----------------------------------------------------------------------------
app.use('/', pagesRoutes);            // pages EJS (home, dashboard)
app.use('/', authRoutes);             // login/logout
app.use('/', usersUiRoutes);          // UI Users (liste + formulaires)

// APIs
app.use('/api', catwaysRoutes);       // Catways CRUD
app.use('/api', reservationsRoutes);  // Reservations CRUD
app.use('/api', usersRoutes);         // Users CRUD

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));

// Health check
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

// 404
app.use((req, res) => res.status(404).send('Page introuvable'));

// -----------------------------------------------------------------------------
// FR : Démarrage après connexion MongoDB
// EN : Start after MongoDB connection
// -----------------------------------------------------------------------------
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      const base = process.env.BASE_URL || `http://localhost:${PORT}`;
      console.log('✅ MongoDB connecté');
      console.log(`✅ Serveur démarré : ${base}`);
      console.log(`📚 Docs Swagger : ${base}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });
