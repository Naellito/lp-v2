// index.js - Serveur principal
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeWebSocket } from './websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware CORS - Autorise toutes les origines en production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? '*' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientPath));
  
  console.log('📂 Serving static files from:', clientPath);
}

// Routes API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route catch-all pour le frontend (doit être APRÈS les routes API)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const clientPath = path.join(__dirname, '../client/dist');
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Initialiser WebSocket
const io = initializeWebSocket(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🐺 Serveur Loup-Garou démarré sur le port ${PORT}`);
  console.log(`📡 WebSocket prêt pour les connexions`);
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});
