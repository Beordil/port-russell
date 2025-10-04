# ⚓ Port Russell — Gestion des Catways & Réservations

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Finalisé-success)

## 📖 Présentation

**Port Russell** est une application web complète (backend + interface web) permettant la **gestion des catways**, **des réservations** et **des utilisateurs** d’un port de plaisance.

Le projet inclut :
- Une **API REST** documentée avec **Swagger**
- Une **interface utilisateur (UI)** complète en **EJS**
- Une **base de données MongoDB**
- Des **routes sécurisées et structurées**
- Un **système de seed** pour initialiser les données

---

## 🧩 Fonctionnalités principales

### 🛠️ Gestion des Catways
- CRUD complet (création, modification, suppression)
- Visualisation des états et types de catways
- Interface stylisée avec badges et tableaux

### 📅 Gestion des Réservations
- CRUD complet avec vérification automatique des chevauchements
- Liaison avec un catway spécifique
- Affichage des réservations en cours sur le tableau de bord

### 👤 Gestion des Utilisateurs
- CRUD complet (nom, email, rôle)
- Validation et gestion d’erreurs (email déjà utilisé, etc.)

### 📊 Tableau de bord
- Affiche les réservations en cours
- Liens rapides vers toutes les sections
- Date et heure dynamiques
- Résumé visuel des données principales

### 📚 Documentation API (Swagger)
- Accessible à `/docs`
- Documente toutes les routes : Users, Catways, Reservations
- Intégration automatique via **swagger-ui-express**

---

## 🧠 Architecture du projet

port-russell/
├── src/
│ ├── config/ # Configuration (DB, Swagger, dotenv)
│ ├── controllers/ # Logique métier (API + UI)
│ ├── middleware/ # Middlewares d’auth & validation
│ ├── models/ # Modèles Mongoose (Catway, Reservation, User)
│ ├── public/ # Fichiers statiques (styles.css, images)
│ ├── routes/ # Routes Express (API + UI)
│ ├── views/ # Templates EJS (UI complète)
│ └── server.js # Point d’entrée principal
│
├── .env # Variables d’environnement
├── package.json # Dépendances et scripts
├── README.md # Documentation (ce fichier)
└── seed_users.js / seed_catways.js # Scripts d’initialisation

yaml
Copier le code

---

## ⚙️ Installation & Configuration

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/Beordil/port-russell.git
cd port-russell
2️⃣ Installer les dépendances
bash
Copier le code
npm install
3️⃣ Créer le fichier .env
bash
Copier le code
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/port-russell
BASE_URL=http://localhost:3000
4️⃣ Lancer le serveur
bash
Copier le code
npm run dev
Le serveur démarre sur :
👉 http://localhost:3000

🧪 Données d’exemple (Seed)
Des scripts de seed permettent d’initialiser la base avec des données cohérentes.

Exemple :
bash
Copier le code
node seed_users.js
node seed_catways.js
Users → admin + user test

Catways → 24 catways configurés avec états et types

Réservations → créées via l’UI ou l’API

🌐 Routes principales
Interface (UI)
Page	URL	Description
Accueil	/	Page d’accueil + connexion
Dashboard	/dashboard	Vue d’ensemble + liens rapides
Catways	/ui/catways	Gestion des catways
Réservations	/ui/reservations	Gestion des réservations
Utilisateurs	/ui/users	Gestion des utilisateurs

API REST
Ressource	Routes principales
Catways	/api/catways, /api/catways/:id
Réservations	/api/reservations, /api/catways/:id/reservations
Users	/api/users, /api/users/:id
Docs Swagger	/docs

🎨 Interface utilisateur
Templates : EJS

Styles : CSS custom (public/styles.css)

Composants :

Barre de navigation (.topbar)

Tableaux dynamiques (.dash-table)

Formulaires en grille (.form-grid)

Badges colorés (.badge-blue, .badge-green)

Cartes (.dash-card)

Responsive (grilles adaptatives <840px)

🔒 Authentification (démo)
Connexion simple par email (sans vrai login backend dans cette version)

Variable userEmail stockée en cookie pour affichage

Middleware requireAuth protège les pages UI sensibles

📘 Documentation API Swagger
URL : /docs

Génération : via swagger-ui-express

Contenu : Users, Catways, Reservations (GET, POST, PUT, DELETE)

🚀 Déploiement
Sur Render
Créer un nouveau service web depuis le repo GitHub

Configurer les variables d’environnement (.env)

Build & Start commands :

bash
Copier le code
npm install
npm run start
Activer la persistance MongoDB via Atlas

💡 Technologies utilisées
Catégorie	Technologies
Backend	Node.js, Express
Frontend	EJS, CSS
Base de données	MongoDB, Mongoose
API Docs	Swagger / OpenAPI
Outils	dotenv, axios, cookie-parser, express-validator

🧑‍💻 Auteur
Julien Delbart
📍 France
💼 Conception & développement fullstack (Node.js / Express / MongoDB / EJS)
🔗 GitHub – Beordil

📜 Licence
Ce projet est distribué sous licence MIT.
Vous êtes libre de le modifier et de le réutiliser avec attribution.

✅ État du projet
✔️ Finalisé — toutes les fonctionnalités sont stables et testées localement.
📦 Version prête à être déployée sur Render ou tout hébergeur Node.js.
