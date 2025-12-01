// index.js - Serveur principal
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initializeWebSocket } from './websocket.js';

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

// Routes de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Serveur Loup-Garou en ligne',
    version: '1.0.0',
  });
});

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
