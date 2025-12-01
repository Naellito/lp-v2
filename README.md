# 🐺 Loup-Garou en Ligne

Un jeu de Loup-Garou multijoueur en temps réel, conçu pour être utilisé pendant vos appels Discord. Le site gère l'affichage visuel des phases, rôles et votes, tandis que les joueurs communiquent vocalement sur Discord.

![Loup-Garou](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io)

## ✨ Fonctionnalités

### 🎮 Gameplay Complet
- **6 rôles** : Villageois, Loup-Garou, Voyante, Sorcière, Cupidon, Chasseur
- **Cycle automatisé** : Nuit/Jour avec toutes les phases gérées
- **Actions en temps réel** : Tous les joueurs voient les changements instantanément
- **Vote intégré** : Système de vote pour le jour et la nuit

### 👥 Double Interface
- **Interface Joueur** : Affiche votre rôle secret, les phases, et vos actions
- **Dashboard Narrateur** : Contrôle complet du jeu avec vue sur tous les rôles

### 🎨 Design Immersif
- **Animations fluides** : Transitions jour/nuit, révélations de morts
- **Thème médiéval dark** : Ambiance village mystérieux
- **Responsive** : Fonctionne sur PC, tablette et mobile

### 🔄 Temps Réel
- Synchronisation instantanée via **WebSocket**
- Reconnexion automatique en cas de déconnexion
- Gestion des joueurs qui quittent

## 📋 Prérequis

- **Node.js** 18 ou supérieur
- **npm** ou **yarn**
- Un navigateur moderne (Chrome, Firefox, Edge, Safari)

## 🚀 Installation

### 1. Cloner le projet

```bash
cd loup-garou-game
```

### 2. Installer le backend

```bash
cd server
npm install
```

### 3. Installer le frontend

```bash
cd ../client
npm install
```

### 4. Configuration

Créer un fichier `.env` dans le dossier `client` :

```bash
cd client
copy .env.example .env
```

Le fichier `.env` contient :
```
VITE_SERVER_URL=http://localhost:3001
```

## 🎯 Démarrage

### Lancer le serveur backend

Dans un terminal :

```bash
cd server
npm start
```

Le serveur démarre sur `http://localhost:3001`

### Lancer le client frontend

Dans un autre terminal :

```bash
cd client
npm run dev
```

Le client démarre sur `http://localhost:3000`

## 🎮 Comment jouer

### 1. Créer une partie

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur **"Créer une partie"**
3. Vous obtenez un **code de partie** (ex: AB4XZ)
4. Partagez ce code avec vos amis sur Discord

### 2. Rejoindre la partie

1. Les joueurs cliquent sur **"Rejoindre une partie"**
2. Entrent le code et leur pseudo
3. Attendent que le narrateur lance la partie

### 3. Démarrer le jeu

Le narrateur :
1. Attend que tous les joueurs soient connectés (minimum 4)
2. Clique sur **"Lancer la partie"**
3. Les rôles sont distribués automatiquement
4. Gère les phases avec le bouton **"Phase suivante"**

### 4. Phases du jeu

#### 🌙 NUIT
1. **Cupidon** (première nuit uniquement) : Forme un couple d'amoureux
2. **Loups-Garous** : Choisissent une victime
3. **Voyante** : Inspecte le rôle d'un joueur
4. **Sorcière** : Peut sauver la victime ou empoisonner quelqu'un

#### ☀️ JOUR
1. **Révélation** : Le narrateur annonce les morts de la nuit
2. **Discussion** : Les joueurs débattent sur Discord (vocal)
3. **Vote** : Élimination d'un joueur suspect
4. **Résultat** : Le joueur éliminé est révélé

### 5. Victoire

- **Village gagne** : Tous les loups-garous sont éliminés
- **Loups gagnent** : Les loups sont aussi nombreux ou plus que les villageois

## 🎭 Rôles et Pouvoirs

| Rôle | Équipe | Pouvoir |
|------|--------|---------|
| 🐺 **Loup-Garou** | Loups | Dévore un villageois chaque nuit |
| 👤 **Villageois** | Village | Aucun pouvoir spécial |
| 🔮 **Voyante** | Village | Voit le rôle d'un joueur chaque nuit |
| 🧪 **Sorcière** | Village | 1 potion de vie + 1 potion de mort |
| 💘 **Cupidon** | Village | Forme un couple la première nuit |
| 🎯 **Chasseur** | Village | Tue quelqu'un en mourant |

## 🎨 Structure du Projet

```
loup-garou-game/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── Button.jsx
│   │   │   ├── PlayerCard.jsx
│   │   │   ├── RoleCard.jsx
│   │   │   ├── PhaseAnimation.jsx
│   │   │   ├── VotePanel.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── GameStatus.jsx
│   │   │   └── DeathReveal.jsx
│   │   ├── pages/            # Pages principales
│   │   │   ├── Home.jsx
│   │   │   ├── CreateRoom.jsx
│   │   │   ├── JoinRoom.jsx
│   │   │   ├── GameRoom.jsx
│   │   │   └── NarratorDashboard.jsx
│   │   ├── context/          # Contextes React
│   │   │   ├── WebSocketContext.jsx
│   │   │   └── GameContext.jsx
│   │   ├── hooks/            # Hooks personnalisés
│   │   │   ├── usePhaseTimer.js
│   │   │   └── useSound.js
│   │   ├── styles/           # Styles CSS
│   │   │   └── index.css
│   │   ├── App.jsx           # Composant principal
│   │   └── main.jsx          # Point d'entrée
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                    # Backend Node.js
    ├── index.js              # Serveur Express
    ├── websocket.js          # Gestion WebSocket
    ├── gameManager.js        # Logique du jeu
    ├── roomManager.js        # Gestion des salles
    ├── roles.js              # Définition des rôles
    ├── phases.js             # Gestion des phases
    └── package.json
```

## 🔧 Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Framer Motion** - Animations fluides
- **Socket.io Client** - Communication temps réel
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.io** - WebSocket temps réel
- **nanoid** - Génération de codes uniques

## 🎯 Utilisation avec Discord

1. **Créez un salon vocal** sur votre serveur Discord
2. **Lancez une partie** et partagez le code
3. **Tout le monde rejoint** la partie sur le site
4. **Communiquez vocalement** sur Discord pendant que le site gère :
   - Les phases du jeu
   - Les rôles secrets
   - Les votes
   - Les révélations

Le narrateur annonce les phases sur Discord et les joueurs votent via l'interface web !

## 🛠️ Scripts Disponibles

### Client

```bash
npm run dev      # Lancer en mode développement
npm run build    # Compiler pour la production
npm run preview  # Prévisualiser le build de production
```

### Server

```bash
npm start        # Lancer le serveur
npm run dev      # Lancer avec auto-reload (Node 18+)
```

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Assurez-vous d'avoir installé les dépendances : `npm install`

### Les joueurs ne voient pas les mises à jour
- Vérifiez que le WebSocket est bien connecté (indicateur vert)
- Rafraîchissez la page (F5)
- Vérifiez le fichier `.env` du client

### Problèmes de déconnexion
- Le serveur dispose d'une reconnexion automatique
- Les joueurs peuvent rejoindre avec le même pseudo s'ils sont déconnectés

## 📝 Notes Importantes

- **Minimum 4 joueurs** requis pour démarrer une partie
- **Maximum 15 joueurs** recommandé pour une expérience optimale
- Les parties sont **automatiquement supprimées** après 24h d'inactivité
- Le **narrateur ne joue pas**, il gère seulement le déroulement

## 🚀 Déploiement

### 🎯 Solution Recommandée : Render.com (Gratuit)

Le projet est **prêt à déployer** sur Render avec la configuration incluse !

👉 **[Voir le guide complet de déploiement](DEPLOIEMENT.md)**

**Étapes rapides :**
1. Push ton code sur GitHub
2. Connecte GitHub à Render.com
3. Crée 2 services (backend + frontend)
4. C'est en ligne ! 🎉

**Coût :** Gratuit (avec sleep après 15 min d'inactivité)

### Autres Options

**Backend :** Heroku, Railway, Fly.io, DigitalOcean
**Frontend :** Vercel, Netlify, GitHub Pages

⚠️ **Important :** Le backend nécessite le support WebSocket (Socket.io)

N'oubliez pas de mettre à jour `VITE_SERVER_URL` avec l'URL de votre serveur déployé.

## 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 👥 Auteurs

Projet créé pour jouer au Loup-Garou avec des amis sur Discord !

## 🎉 Amusez-vous bien !

N'oubliez pas : les loups-garous sont parmi nous... 🐺

---

**Made with ❤️ for Discord gaming sessions**
