# 🎮 GUIDE DE DÉMARRAGE RAPIDE

## 📦 Installation rapide

### Windows (PowerShell)

```powershell
# 1. Backend
cd server
npm install

# 2. Frontend (dans un nouveau terminal)
cd ..\client
npm install
Copy-Item .env.example .env
```

### Lancer l'application

**Terminal 1 - Backend :**
```powershell
cd server
npm start
```

**Terminal 2 - Frontend :**
```powershell
cd client
npm run dev
```

**Ouvrez votre navigateur sur : http://localhost:3000**

---

## 🎯 Premiers pas

### 1️⃣ Créer une partie (Narrateur)
- Cliquez sur **"Créer une partie"**
- Notez le code (ex: AB4XZ)
- Partagez-le sur Discord

### 2️⃣ Rejoindre (Joueurs)
- Cliquez sur **"Rejoindre une partie"**
- Entrez le code + votre pseudo
- Attendez le démarrage

### 3️⃣ Jouer
- **Narrateur** : Contrôle les phases via le dashboard
- **Joueurs** : Suivent les instructions et votent via l'interface
- **Discord** : Tout le monde parle vocalement !

---

## 🔥 Conseils

✅ Minimum 4 joueurs requis
✅ Idéal entre 6-12 joueurs
✅ Le narrateur ne joue pas, il anime
✅ Utilisez Discord pour parler
✅ Le site gère l'affichage et les votes

---

## 🐛 Problème ?

**Serveur ne démarre pas :**
- Vérifiez Node.js : `node --version` (doit être ≥ 18)
- Port occupé ? Changez dans `server/index.js`

**Client ne se connecte pas :**
- Vérifiez le fichier `client/.env`
- Le serveur doit tourner sur le port 3001

**WebSocket erreur :**
- Rafraîchir la page (F5)
- Relancer le serveur

---

## 📞 Support

Si vous avez des questions, consultez le README.md complet !

**Bon jeu ! 🐺**
