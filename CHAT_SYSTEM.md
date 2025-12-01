# 💬 Système de Chat - Loup-Garou Game

## 🎯 Fonctionnalités

### **Chat Général du Village** 
- 💬 Accessible à **tous les joueurs**
- ☀️ **Actif pendant le jour** uniquement
- 🌙 **Désactivé la nuit** (le village dort)
- 📍 Bouton bleu en bas à droite de l'écran

### **Chat Privé des Loups-Garous** 
- 🐺 Accessible **uniquement aux Loups-Garous**
- 🌙 **Actif jour ET nuit** (coordination secrète)
- 🔒 Messages invisibles pour les autres joueurs
- 📍 Bouton rouge en bas à droite (à côté du chat général)

## ✨ Caractéristiques

### **Interface**
- 🎨 Design adapté au thème médiéval sombre
- 💫 Animations fluides d'ouverture/fermeture
- 📊 Badge avec compteur de nouveaux messages
- 🎭 Emoji de rôle à côté du pseudo
- ⏰ Horodatage de chaque message

### **Expérience utilisateur**
- ✅ Historique complet des messages
- ✅ Scroll automatique vers les nouveaux messages
- ✅ Indicateur visuel quand le chat est désactivé
- ✅ Limite de 200 caractères par message
- ✅ Animation de pulsation pour attirer l'attention

### **Messages système**
- 📢 Notifications automatiques (ex: "La nuit tombe...")
- 🎨 Style différent (jaune italique)
- ⚡ Broadcast automatique selon le type de chat

## 🎮 Utilisation

### **Pour les joueurs normaux :**
1. Cliquez sur le bouton **💬** en bas à droite
2. Écrivez votre message (max 200 caractères)
3. Appuyez sur Entrée ou cliquez sur 📤
4. Le message est envoyé à tous les joueurs

### **Pour les Loups-Garous :**
1. **Chat du village** : Bouton **💬** (bleu) - Communication publique
2. **Chat des loups** : Bouton **🐺** (rouge) - Communication secrète
3. Les deux chats sont indépendants et ont leur propre historique

## 🔧 Fonctionnement Technique

### **Backend (WebSocket)**
```javascript
// ÉvénementsSocket.io
'send-chat-message' → Envoyer un message
'chat-message' → Recevoir un message
'send-system-message' → Message automatique du système
```

### **Frontend (React)**
```javascript
// États dans GameContext
chatMessages → Messages du chat général
werewolfChatMessages → Messages du chat des loups

// Fonction pour envoyer
sendChatMessage(message, chatType)
// chatType: 'general' ou 'werewolf'
```

### **Logique de diffusion**
- **Chat général** : Tous les joueurs (sauf narrateur)
- **Chat loups** : Uniquement les joueurs avec role === 'loup-garou'
- **Messages système** : Selon le chatType spécifié

## 🎨 Personnalisation

### **Couleurs par type de chat**
- **Village** : Bleu (`from-blue-900 to-blue-950`)
- **Loups** : Rouge (`from-red-900 to-red-950`)

### **Emojis par rôle**
- 🐺 Loup-Garou
- 🔮 Voyante
- 🧪 Sorcière
- 💘 Cupidon
- 🎯 Chasseur
- 👤 Villageois

## 📝 Améliorations futures possibles

- [ ] Commandes slash (/vote, /accuse, etc.)
- [ ] Mentions de joueurs avec @
- [ ] GIFs ou emojis réactifs
- [ ] Historique sauvegardé entre sessions
- [ ] Mode "muet" pour désactiver les notifications
- [ ] Chat vocal intégré (alternative à Discord)
- [ ] Traduction automatique multilingue

## 🐛 Dépannage

**Le chat ne s'affiche pas ?**
- Vérifiez que vous n'êtes pas le narrateur
- Assurez-vous que la partie a démarré

**Impossible d'envoyer de messages ?**
- Chat général : Vérifiez que c'est le jour
- Vérifiez votre connexion WebSocket

**Les loups ne voient pas leur chat ?**
- Le chat des loups n'apparaît que si myRole === 'loup-garou'
- Vérifiez que les rôles ont bien été distribués

---

🎮 **Amusez-vous bien et bonne coordination !** 🐺💬
