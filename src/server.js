// FR : Modules de base
// EN : Core modules
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// FR : Connexion à MongoDB
// EN : MongoDB connection
const { connectDB } = require('./config/db');

// FR : Import des routes
// EN : Import routes
const pagesRoutes = require('./routes/pages.routes');
const authRoutes = require('./routes/auth.routes');
const catwaysRoutes = require('./routes/catways.routes');
const reservationsRoutes = require('./routes/reservations.routes');

// FR : Swagger (UI + config générée)
// EN : Swagger (UI + generated config)
const swaggerUi = require('swagger-ui-express');
const { openapiSpec } = require('./config/swagger');

// FR : Initialisation de l’application Express
// EN : Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// FR : Configuration EJS (views/templates)
// EN : EJS configuration (views/templates)
// ---------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------------------
// FR : Middlewares globaux
// EN : Global middlewares
// ---------------------------
app.use(express.urlencoded({ extended: false })); // FR : Parse formulaires | EN : Parse forms
app.use(express.json());                          // FR : Parse JSON      | EN : Parse JSON
app.use(cookieParser());                          // FR : Parse cookies   | EN : Parse cookies

// ---------------------------
// FR : Fichiers statiques (CSS, images, JS côté client)
// EN : Static files (CSS, images, client-side JS)
// ---------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------
// FR : Routes principales
// EN : Main routes
// ---------------------------
app.use('/', pagesRoutes);           // FR : pages EJS (login, dashboard) | EN : EJS pages (login, dashboard)
app.use('/', authRoutes);            // FR : login/logout                 | EN : login/logout
app.use('/api', catwaysRoutes);      // FR : API CRUD catways             | EN : API CRUD catways
app.use('/api', reservationsRoutes); // FR : API CRUD reservations        | EN : API CRUD reservations

// ---------------------------
// FR : Documentation Swagger (UI sur /docs)
// EN : Swagger documentation (UI on /docs)
// ---------------------------
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { explorer: true }));

// ---------------------------
// FR : Middleware 404 (si aucune route correspondante)
// EN : 404 middleware (if no route matches)
// ---------------------------
app.use((req, res) => res.status(404).send('Page introuvable'));

// ---------------------------
// FR : Connexion à MongoDB + démarrage du serveur Express
// EN : Connect to MongoDB + start Express server
// ---------------------------
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ MongoDB connecté');
      console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
      console.log(`📚 Docs Swagger : http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message);
    process.exit(1);
  });
