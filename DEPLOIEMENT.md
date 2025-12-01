# 🚀 Guide de Déploiement - Render.com

## 📋 Prérequis

1. ✅ Compte GitHub (gratuit)
2. ✅ Compte Render.com (gratuit)
3. ✅ Git installé sur ton PC

---

## 📦 Étape 1 : Préparer le Code pour GitHub

### 1.1 Créer un fichier .gitignore (si pas déjà fait)

Créé automatiquement, mais vérifie qu'il contient :

```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
```

### 1.2 Initialiser Git (si pas déjà fait)

Ouvre PowerShell dans le dossier `loup-garou-game` :

```powershell
# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Jeu Loup-Garou complet"
```

### 1.3 Créer un Repository sur GitHub

1. Va sur https://github.com
2. Clique sur **"New repository"**
3. Nom : `loup-garou-game`
4. Visibilité : **Public** (obligatoire pour Render gratuit)
5. Ne coche RIEN d'autre
6. Clique sur **"Create repository"**

### 1.4 Pusher ton Code

GitHub te donne les commandes, sinon :

```powershell
# Ajoute l'origine GitHub (remplace TON_USERNAME)
git remote add origin https://github.com/TON_USERNAME/loup-garou-game.git

# Change la branche en main
git branch -M main

# Push
git push -u origin main
```

---

## 🌐 Étape 2 : Déployer sur Render

### 2.1 Créer un Compte Render

1. Va sur https://render.com
2. Clique sur **"Get Started for Free"**
3. Connecte-toi avec **GitHub** (recommandé)

### 2.2 Créer les Services

#### A) Déployer le BACKEND (serveur)

1. Sur le dashboard Render, clique **"New +"** → **"Web Service"**

2. Connecte ton repository GitHub :
   - Sélectionne `loup-garou-game`
   - Clique **"Connect"**

3. Configuration du service :
   ```
   Name: loup-garou-server
   Region: Frankfurt (EU Central)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. Variables d'environnement (optionnel) :
   - Clique **"Advanced"**
   - Ajoute :
     ```
     NODE_ENV = production
     PORT = 3001
     ```

5. Clique **"Create Web Service"**

6. ⏳ **Attends 5-10 minutes** que le build se termine

7. ✅ Une fois déployé, **COPIE l'URL** (ex: `https://loup-garou-server.onrender.com`)

#### B) Déployer le FRONTEND (client)

1. Retour au dashboard, clique **"New +"** → **"Web Service"**

2. Sélectionne encore `loup-garou-game`

3. Configuration du service :
   ```
   Name: loup-garou-client
   Region: Frankfurt (EU Central)
   Branch: main
   Root Directory: client
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run preview -- --host 0.0.0.0 --port $PORT
   Plan: Free
   ```

4. Variables d'environnement **IMPORTANTES** :
   - Clique **"Advanced"**
   - Ajoute (remplace par TON URL backend de l'étape A.7) :
     ```
     VITE_SERVER_URL = https://loup-garou-server.onrender.com
     NODE_ENV = production
     ```

5. Clique **"Create Web Service"**

6. ⏳ **Attends 5-10 minutes** que le build se termine

7. ✅ Une fois déployé, ton jeu est accessible à l'URL affichée !

---

## 🎮 Étape 3 : Tester ton Jeu en Ligne

1. Ouvre l'URL du **frontend** (ex: `https://loup-garou-client.onrender.com`)
2. ⏱️ **Première visite :** Attends 30 secondes (réveil du serveur)
3. ✅ Crée une partie et teste !

---

## 🔧 Mise à Jour du Code

Quand tu modifies ton code en local :

```powershell
# Enregistre tes changements
git add .
git commit -m "Description de tes changements"

# Envoie sur GitHub
git push

# ✨ Render détecte automatiquement et redéploie !
```

---

## 🐛 Dépannage

### Problème : "Service Unavailable"
- ⏱️ Le serveur est en train de se réveiller (30 secondes)
- 🔄 Rafraîchis la page

### Problème : Le client ne se connecte pas au serveur
- ✅ Vérifie que `VITE_SERVER_URL` dans les variables d'environnement Render (frontend) pointe bien vers l'URL du backend
- 🔄 Redéploie le frontend (bouton "Manual Deploy" → "Clear build cache & deploy")

### Problème : Build Failed
- 📋 Regarde les logs dans Render (onglet "Logs")
- ❌ Souvent : dépendances manquantes
- 🔧 Vérifie que tous les `package.json` sont corrects

### Voir les logs en temps réel
- Dashboard Render → Clique sur ton service → Onglet **"Logs"**

---

## 💰 Coûts

- ✅ **Gratuit** pour 2 services (frontend + backend)
- ⏱️ Sleep après 15 min d'inactivité (réveil en 30s)
- 📊 750 heures/mois par service (largement suffisant)

---

## 🎯 URLs Finales

Après déploiement, tu auras :

```
Backend:  https://loup-garou-server.onrender.com
Frontend: https://loup-garou-client.onrender.com

→ Partage l'URL du FRONTEND à tes potes ! 🎮
```

---

## 🔗 Liens Utiles

- Dashboard Render : https://dashboard.render.com
- Documentation Render : https://render.com/docs
- Ton GitHub : https://github.com/TON_USERNAME/loup-garou-game

---

## ✨ C'est Tout !

Une fois déployé, ton jeu est accessible de **n'importe où dans le monde** ! 🌍

Bon jeu ! 🐺🎮
