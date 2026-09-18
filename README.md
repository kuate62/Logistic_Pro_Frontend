# 🌐 LogisticPro - Frontend Web Application

> **Interface web moderne et réactive pour la plateforme SaaS de gestion logistique et transport de colis.**

[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v8-purple.svg)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-v5-orange.svg)](https://github.com/pmndrs/zustand)
[![React Router](https://img.shields.io/badge/React%20Router-v7-red.svg)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Présentation

**LogisticPro Frontend** est l'application cliente Single Page Application (SPA) de la suite LogisticPro. Elle offre une expérience utilisateur fluide, moderne et sécurisée adaptée à tous les profils d'utilisateurs :

- **Portail Public / SaaS** : Landing page marketing, présentation des fonctionnalités, grille tarifaire, suivi public des colis, formulaire de demande de partenariat B2B.
- **Portail Client** : Historique des envois, suivi d'état des colis étape par étape, téléchargement de bordereaux/factures, gestion des paiements.
- **Portail Administrateur Compagnie & Agences** : Création et gestion des expéditions en 5 étapes (wizard), gestion des agences locales, des chauffeurs et employés, suivi des caisses et encaissements, statistiques de livraison.
- **Portail Super Admin (SaaS)** : Gestion multi-entreprises, modération des demandes partenaires, gestion des plans et abonnements SaaS.

---

## 🏗️ Structure du Projet

```text
ProjectFrontend/
├── public/
│   ├── _redirects              # Règle de routage SPA pour Netlify / Cloudflare
│   └── vite.svg
├── src/
│   ├── api/                    # Clients API Axios (Auth, Shipments, Parcels, Payments, Clients, etc.)
│   ├── components/             # Composants d'interface réutilisables (Layouts, Navbars, Modals, Forms)
│   │   ├── auth/               # Formulaires de connexion / inscription / reset password
│   │   ├── client/             # Composants spécifiques au portail client
│   │   ├── common/             # Composants UI transverses (Badges, Alerts, Tables, Loaders)
│   │   ├── landing/            # Sections de la landing page SaaS
│   │   └── shipments/          # Wizard de création et fiches détails d'expéditions
│   ├── hooks/                  # Hooks personnalisés (useAuth, useShipment, useClientShipment, etc.)
│   ├── pages/                  # Vues principales de l'application
│   │   ├── admin/              # Tableaux de bord et gestion admin
│   │   ├── client/             # Espace client
│   │   └── public/             # Pages publiques (Accueil, Tarifs, Tracking, Contact)
│   ├── router/                 # Configuration des routes React Router (Protection RBAC)
│   ├── store/                  # Stores d'état global Zustand (Auth, Expéditions, Colis, UI)
│   ├── utils/                  # Fonctions utilitaires (Formatage dates/prix, validation)
│   ├── App.jsx                 # Composant racine
│   ├── main.jsx                # Point d'entrée React
│   └── index.css               # Styles globaux & tokens CSS
├── .env.example                # Modèle des variables d'environnement
├── vercel.json                 # Configuration SPA pour le déploiement Vercel
├── vite.config.js              # Configuration Vite
└── package.json
```

---

## ⚙️ Prérequis

- **Node.js** : `18.x` ou supérieur
- **NPM** (inclus avec Node.js)
- Une instance active du backend **LogisticPro Backend** (en local ou déployé)

---

## 🚀 Installation & Lancement Local

### 1. Cloner le dépôt
```bash
git clone https://github.com/kuate62/LogisticPro.git
cd LogisticPro
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Copiez le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```
Assurez-vous que l'URL pointe vers votre API Backend :
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Démarrer le serveur de développement
```bash
npm run dev
```
L'application est accessible sur : `http://localhost:5173`.

---

## 🛠️ Scripts Disponibles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Démarre le serveur local de dev avec Hot Module Reloading (HMR) |
| `npm run build` | Compile l'application en bundle de production optimisé dans le dossier `dist/` |
| `npm run preview` | Prévisualise localement le bundle de production généré |
| `npm run lint` | Exécute l'analyseur ESLint pour vérifier la qualité du code |

---

## 🚢 Guide de Déploiement en Production

### Option 1 : Déploiement sur Vercel (Recommandé)

1. Connectez votre compte **[Vercel](https://vercel.com)** à votre dépôt GitHub.
2. Cliquez sur **Add New Project** et sélectionnez le dépôt `LogisticPro`.
3. Vercel détecte automatiquement la configuration **Vite** :
   - **Framework Preset** : `Vite`
   - **Root Directory** : `./`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
4. Ajoutez la variable d'environnement :
   - `VITE_API_URL` = `https://votre-backend-api.onrender.com/api` (URL de votre API de production)
5. Cliquez sur **Deploy**.
*(Grâce au fichier `vercel.json` inclus, le routage SPA React Router fonctionne immédiatement sans configuration supplémentaire).*

---

### Option 2 : Déploiement sur Netlify

1. Connectez votre compte **[Netlify](https://netlify.com)** à GitHub.
2. Créez un nouveau site depuis Git.
3. Paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
4. Dans **Site configuration > Environment variables**, ajoutez :
   - `VITE_API_URL` = `https://votre-backend-api.onrender.com/api`
5. Déployez le site. *(Le fichier `public/_redirects` gère automatiquement les routes).*

---

### Option 3 : Déploiement Nginx (VPS ou Docker)

Si vous hébergez le frontend sur votre propre serveur Ubuntu / Nginx :
1. Construisez le projet : `npm run build`
2. Copiez le contenu de `dist/` vers `/var/www/logisticpro-frontend`.
3. Configuration Nginx (`/etc/nginx/sites-available/logisticpro.com`) :
```nginx
server {
    listen 80;
    server_name logisticpro.com www.logisticpro.com;
    root /var/www/logisticpro-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 👥 Auteur & Contribution

- **Équipe de développement** : Bluehub / LogisticPro Team
- **Dépôt GitHub** : [LogisticPro](https://github.com/kuate62/LogisticPro)
