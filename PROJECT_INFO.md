# 📁 STRUCTURE COMPLÈTE DU PROJET

## 🗂️ Arborescence

```
loup-garou-game/
│
├── 📄 README.md                 # Documentation complète
├── 📄 QUICK_START.md            # Guide de démarrage rapide
├── 📄 GUIDE_NARRATEUR.md        # Guide détaillé pour le narrateur
├── 📄 .gitignore                # Fichiers à ignorer par Git
│
├── 🪟 install.bat               # Script d'installation Windows
├── 🪟 start-server.bat          # Script de lancement serveur
├── 🪟 start-client.bat          # Script de lancement client
│
├── 📁 server/                   # BACKEND (Node.js + Socket.io)
│   ├── 📄 package.json          # Dépendances backend
│   ├── 📄 index.js              # Serveur Express principal
│   ├── 📄 websocket.js          # Gestion WebSocket temps réel
│   ├── 📄 gameManager.js        # Logique complète du jeu
│   ├── 📄 roomManager.js        # Gestion des salles/joueurs
│   ├── 📄 roles.js              # Définition des 6 rôles
│   └── 📄 phases.js             # Gestion cycle nuit/jour
│
└── 📁 client/                   # FRONTEND (React + Vite + Tailwind)
    ├── 📄 package.json          # Dépendances frontend
    ├── 📄 vite.config.js        # Configuration Vite
    ├── 📄 tailwind.config.js    # Configuration Tailwind CSS
    ├── 📄 postcss.config.js     # Configuration PostCSS
    ├── 📄 index.html            # Point d'entrée HTML
    ├── 📄 .env                  # Variables d'environnement
    ├── 📄 .env.example          # Exemple de configuration
    │
    └── 📁 src/
        ├── 📄 main.jsx          # Point d'entrée React
        ├── 📄 App.jsx           # Composant principal + routes
        │
        ├── 📁 components/       # Composants réutilisables
        │   ├── Button.jsx             # Bouton stylisé
        │   ├── PlayerCard.jsx         # Carte joueur
        │   ├── RoleCard.jsx           # Carte rôle (flip)
        │   ├── PhaseAnimation.jsx     # Animations phases
        │   ├── VotePanel.jsx          # Panneau de vote
        │   ├── Timer.jsx              # Compte à rebours
        │   ├── GameStatus.jsx         # Statut de la partie
        │   └── DeathReveal.jsx        # Révélation des morts
        │
        ├── 📁 pages/            # Pages principales
        │   ├── Home.jsx               # Page d'accueil
        │   ├── CreateRoom.jsx         # Création de partie
        │   ├── JoinRoom.jsx           # Rejoindre partie
        │   ├── GameRoom.jsx           # Salle de jeu (joueur)
        │   └── NarratorDashboard.jsx  # Dashboard narrateur
        │
        ├── 📁 context/          # Contextes React
        │   ├── WebSocketContext.jsx   # Gestion WebSocket
        │   └── GameContext.jsx        # État global du jeu
        │
        ├── 📁 hooks/            # Hooks personnalisés
        │   ├── usePhaseTimer.js       # Timer de phase
        │   └── useSound.js            # Sons (optionnel)
        │
        ├── 📁 utils/            # Utilitaires
        │   └── constants.js           # Constantes du jeu
        │
        └── 📁 styles/           # Styles CSS
            └── index.css              # Styles globaux + Tailwind
```

---

## 📊 Statistiques du projet

### Lignes de code
- **Backend** : ~1,200 lignes
- **Frontend** : ~3,000 lignes
- **Total** : ~4,200 lignes de code

### Fichiers
- **Fichiers totaux** : 32
- **Composants React** : 8
- **Pages** : 5
- **Modules backend** : 6

### Technologies
- **React 18** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.io** - WebSocket
- **Express** - Server
- **Node.js** - Runtime

---

## 🎯 Fonctionnalités implémentées

### ✅ Backend complet
- [x] Serveur Express
- [x] WebSocket temps réel
- [x] Gestion des rooms
- [x] Gestion des joueurs
- [x] Distribution des rôles
- [x] Logique complète du jeu
- [x] Cycle nuit/jour automatisé
- [x] Validation des actions
- [x] Vérification de victoire
- [x] Reconnexion automatique
- [x] Nettoyage des rooms inactives

### ✅ Rôles implémentés (6)
- [x] Villageois
- [x] Loup-Garou (vote collectif)
- [x] Voyante (inspection)
- [x] Sorcière (2 potions)
- [x] Cupidon (couple)
- [x] Chasseur (revenge kill)

### ✅ Phases du jeu (11)
- [x] Lobby (attente)
- [x] Nuit - Introduction
- [x] Nuit - Cupidon
- [x] Nuit - Loups-Garous
- [x] Nuit - Voyante
- [x] Nuit - Sorcière
- [x] Jour - Réveil
- [x] Jour - Discussion
- [x] Jour - Vote
- [x] Jour - Résultat
- [x] Game Over

### ✅ Interface joueur
- [x] Page d'accueil
- [x] Création de partie
- [x] Rejoindre partie
- [x] Affichage du rôle
- [x] Actions par rôle
- [x] Vote du jour
- [x] Animations de phase
- [x] Révélation des morts
- [x] Écran de victoire
- [x] Mode spectateur (mort)

### ✅ Dashboard narrateur
- [x] Création de room
- [x] Gestion des joueurs
- [x] Vue de tous les rôles
- [x] Contrôle des phases
- [x] Vue des votes en temps réel
- [x] Statistiques de partie
- [x] Expulsion de joueurs
- [x] Instructions par phase

### ✅ UI/UX
- [x] Design dark médiéval
- [x] Animations fluides
- [x] Responsive design
- [x] Cartes rôles (flip)
- [x] Transitions jour/nuit
- [x] Compte à rebours
- [x] Effets visuels
- [x] Indicateurs de connexion

### ✅ Documentation
- [x] README complet
- [x] Guide de démarrage rapide
- [x] Guide du narrateur
- [x] Commentaires dans le code
- [x] Scripts d'installation
- [x] Variables d'environnement

---

## 🔧 Configuration requise

### Serveur
- Node.js 18+
- Port 3001 disponible
- 512 MB RAM minimum

### Client
- Navigateur moderne
- JavaScript activé
- WebSocket supporté

### Recommandé
- 4-12 joueurs
- Connexion Discord
- Micro pour vocal

---

## 🚀 Commandes disponibles

### Backend
```bash
npm install    # Installer les dépendances
npm start      # Lancer le serveur
npm run dev    # Lancer avec auto-reload
```

### Frontend
```bash
npm install    # Installer les dépendances
npm run dev    # Lancer en développement
npm run build  # Compiler pour production
npm run preview # Prévisualiser le build
```

---

## 📦 Dépendances

### Backend
- express (^4.18.2)
- socket.io (^4.7.2)
- cors (^2.8.5)
- nanoid (^5.0.4)

### Frontend
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.20.0)
- socket.io-client (^4.7.2)
- framer-motion (^10.16.16)
- vite (^5.0.8)
- tailwindcss (^3.4.0)

---

## 🎨 Palette de couleurs

```css
Dark Blue:     #0f1729  (Fond principal)
Night Purple:  #1a1a3e  (Fond nuit)
Day Yellow:    #ffd966  (Jour)
Blood Red:     #8b0000  (Loups)
Wolf Gray:     #2d3748  (Cartes)
```

---

## 🔐 Variables d'environnement

### Client (.env)
```
VITE_SERVER_URL=http://localhost:3001
```

### Serveur
```
PORT=3001  # (optionnel, par défaut)
```

---

## 📈 Évolutions possibles

### Améliorations futures
- [ ] Ajout de rôles (Garde, Ancien, etc.)
- [ ] Système de sons/musiques
- [ ] Historique des parties
- [ ] Statistiques joueurs
- [ ] Chat textuel intégré
- [ ] Sauvegarde parties
- [ ] Mode personnalisé (choix des rôles)
- [ ] Support multi-langues
- [ ] Thèmes alternatifs
- [ ] Replay de parties

### Déploiement
- [ ] Docker containers
- [ ] CI/CD pipeline
- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] Monitoring
- [ ] Logs structurés

---

## 🐛 Débogage

### Logs serveur
Les logs apparaissent dans la console du serveur :
- Connexions/déconnexions
- Création de rooms
- Actions des joueurs

### Logs client
Ouvrez la console navigateur (F12) pour voir :
- État WebSocket
- Actions envoyées/reçues
- Erreurs éventuelles

---

## 🤝 Contribution

Le projet est open source. Pour contribuer :

1. Fork le repository
2. Créez une branche feature
3. Committez vos changements
4. Pushez vers la branche
5. Ouvrez une Pull Request

---

## 📄 Licence

MIT License - Libre d'utilisation et modification

---

## 🎉 Crédits

**Créé pour jouer au Loup-Garou entre amis sur Discord**

Développé avec ❤️ en React et Node.js

---

**Version 1.0.0** - Décembre 2025
