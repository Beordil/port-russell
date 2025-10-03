# ⚓ Port Russell — Gestion des Catways & Réservations

Application pédagogique (Node.js / Express / MongoDB / EJS) permettant de gérer :
- Les **catways** (ponton du port)  
- Les **réservations** associées  

---

## 🚀 Fonctionnalités

- API REST avec **CRUD complet**
- **Validations défensives** (express-validator)
- **Contrôle de chevauchement** pour les réservations
- **Seeds JSON** pour données initiales (`catways.json`, `reservations.json`)
- Documentation API via **Swagger UI** (`/docs`)
- Vues serveur **EJS** (Accueil + Dashboard)
- Code commenté en **français et anglais (JSDoc)**

---

## 📦 Installation

### 1. Prérequis
- [Node.js](https://nodejs.org/) v18+  
- Un cluster [MongoDB Atlas](https://www.mongodb.com/atlas) (ou MongoDB local)

### 2. Cloner le projet
```bash
git clone https://github.com/Beordil/port-russell.git
cd port-russell
