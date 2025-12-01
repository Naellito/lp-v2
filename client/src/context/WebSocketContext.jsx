// WebSocketContext.jsx - Contexte pour gérer la connexion WebSocket
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Détermine l'URL du serveur au runtime (pas au build)
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || 
                       (import.meta.env.PROD ? window.location.origin : 'http://localhost:3001');
    
    console.log('🔌 Tentative de connexion WebSocket à:', SERVER_URL);
    
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Erreur de connexion:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket doit être utilisé dans un WebSocketProvider');
  }
  return context;
}
