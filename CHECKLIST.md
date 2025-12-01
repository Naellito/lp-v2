# ✅ CHECKLIST DE VÉRIFICATION

## 🎯 Installation

Avant de lancer le jeu, vérifiez que vous avez bien :

### Prérequis
- [ ] Node.js installé (version 18+)
  - Vérifiez avec : `node --version`
- [ ] npm installé
  - Vérifiez avec : `npm --version`
- [ ] Git installé (optionnel)
  - Vérifiez avec : `git --version`

---

## 📦 Installation du projet

### Méthode automatique (Windows)
- [ ] Double-cliquer sur `install.bat`
- [ ] Attendre la fin de l'installation
- [ ] Vérifier qu'aucune erreur n'apparaît

### Méthode manuelle
- [ ] `cd server && npm install`
- [ ] `cd ../client && npm install`
- [ ] `copy .env.example .env` (dans le dossier client)

---

## 🚀 Lancement

### Méthode automatique (Windows)
- [ ] Double-cliquer sur `start-server.bat`
- [ ] Double-cliquer sur `start-client.bat` (dans une autre fenêtre)
- [ ] Le navigateur s'ouvre sur `http://localhost:3000`

### Méthode manuelle
Terminal 1 :
- [ ] `cd server`
- [ ] `npm start`
- [ ] Voir : "🐺 Serveur Loup-Garou démarré sur le port 3001"

Terminal 2 :
- [ ] `cd client`
- [ ] `npm run dev`
- [ ] Voir : "Local: http://localhost:3000"

---

## 🔍 Vérifications

### Serveur backend
- [ ] Console affiche "Serveur démarré sur le port 3001"
- [ ] Console affiche "WebSocket prêt pour les connexions"
- [ ] Aucune erreur rouge dans la console
- [ ] `http://localhost:3001/health` retourne `{"status":"OK"}`

### Client frontend
- [ ] Page d'accueil s'affiche
- [ ] Logo du loup (🐺) visible
- [ ] Boutons "Créer une partie" et "Rejoindre" cliquables
- [ ] Pas d'erreurs dans la console navigateur (F12)

### WebSocket
- [ ] Indicateur de connexion vert (ou message "Connecté")
- [ ] Pas de message "Connexion au serveur..."

---

## 🎮 Test rapide

### Test création de partie
- [ ] Cliquer sur "Créer une partie"
- [ ] Un code de 5 lettres apparaît (ex: AB4XZ)
- [ ] Page "Dashboard Narrateur" s'affiche
- [ ] Section "Joueurs connectés" visible

### Test rejoindre
- [ ] Ouvrir un nouvel onglet/navigateur
- [ ] Cliquer sur "Rejoindre une partie"
- [ ] Entrer le code + un pseudo
- [ ] Arriver sur la salle d'attente
- [ ] Voir son nom dans la liste

### Test démarrage
- [ ] (Narrateur) Avoir au moins 4 joueurs
- [ ] Cliquer sur "Lancer la partie"
- [ ] Animation "La nuit tombe" apparaît
- [ ] (Joueurs) Voir leur rôle s'afficher

---

## 📁 Fichiers présents

### Racine
- [ ] README.md
- [ ] QUICK_START.md
- [ ] GUIDE_NARRATEUR.md
- [ ] PROJECT_INFO.md
- [ ] CHECKLIST.md (ce fichier)
- [ ] .gitignore
- [ ] install.bat
- [ ] start-server.bat
- [ ] start-client.bat

### Backend (server/)
- [ ] package.json
- [ ] index.js
- [ ] websocket.js
- [ ] gameManager.js
- [ ] roomManager.js
- [ ] roles.js
- [ ] phases.js
- [ ] node_modules/ (après installation)

### Frontend (client/)
- [ ] package.json
- [ ] vite.config.js
- [ ] tailwind.config.js
- [ ] postcss.config.js
- [ ] index.html
- [ ] .env
- [ ] .env.example
- [ ] src/main.jsx
- [ ] src/App.jsx
- [ ] src/components/ (8 fichiers)
- [ ] src/pages/ (5 fichiers)
- [ ] src/context/ (2 fichiers)
- [ ] src/hooks/ (2 fichiers)
- [ ] src/utils/ (1 fichier)
- [ ] src/styles/ (1 fichier)
- [ ] node_modules/ (après installation)

---

## 🔧 Problèmes courants

### "Port 3001 déjà utilisé"
- [ ] Fermer l'autre application sur ce port
- [ ] Ou changer le port dans `server/index.js`

### "Cannot find module"
- [ ] Relancer `npm install` dans le dossier concerné
- [ ] Supprimer `node_modules` et réinstaller

### "WebSocket connection failed"
- [ ] Vérifier que le serveur est bien lancé
- [ ] Vérifier le fichier `client/.env`
- [ ] Essayer de rafraîchir la page (F5)

### "Erreur lors de la création de la partie"
- [ ] Vérifier la connexion au serveur
- [ ] Regarder les logs serveur pour plus d'infos

---

## 🎯 Prêt à jouer !

Si toutes les cases sont cochées, vous êtes prêt ! 🎉

### Pour jouer :
1. **Créez un salon vocal Discord**
2. **Créez une partie** (narrateur)
3. **Partagez le code** sur Discord
4. **Les joueurs rejoignent**
5. **Lancez la partie**
6. **Parlez sur Discord, votez sur le site !**

---

## 📞 Besoin d'aide ?

Consultez :
- **README.md** - Documentation complète
- **QUICK_START.md** - Démarrage rapide
- **GUIDE_NARRATEUR.md** - Guide pour animer
- **PROJECT_INFO.md** - Infos techniques

---

## 🐺 Bon jeu !

**Que le meilleur camp gagne !**

---

*Version 1.0.0 - Projet complet et fonctionnel*
