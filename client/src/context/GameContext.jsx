// GameContext.jsx - Contexte principal du jeu
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './WebSocketContext';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { socket, connected } = useWebSocket();
  
  // État de la room
  const [roomCode, setRoomCode] = useState(null);
  const [isNarrator, setIsNarrator] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  
  // État du joueur
  const [player, setPlayer] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [myTeam, setMyTeam] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [isAlive, setIsAlive] = useState(true);
  const [inLove, setInLove] = useState(false);
  const [lovePartner, setLovePartner] = useState(null);
  
  // État du jeu
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState('lobby');
  const [nightCount, setNightCount] = useState(0);
  const [dayCount, setDayCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [deaths, setDeaths] = useState([]);
  const [winner, setWinner] = useState(null);
  
  // État spécifique aux rôles
  const [werewolfVotes, setWerewolfVotes] = useState({});
  const [seerResult, setSeerResult] = useState(null);
  const [witchPotions, setWitchPotions] = useState({ heal: true, kill: true });
  const [nightVictim, setNightVictim] = useState(null);

  // État du chat
  const [chatMessages, setChatMessages] = useState([]);
  const [werewolfChatMessages, setWerewolfChatMessages] = useState([]);

  // Créer une room
  const createRoom = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('create-room', (response) => {
        if (response.success) {
          setRoomCode(response.roomCode);
          setIsNarrator(true);
          setIsInRoom(true);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket]);

  // Rejoindre une room
  const joinRoom = useCallback((code, username) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('join-room', { roomCode: code, username }, (response) => {
        if (response.success) {
          setRoomCode(response.roomCode);
          setPlayer(response.player);
          setPlayers(response.players);
          setIsInRoom(true);
          setIsNarrator(false);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket]);

  // Lancer la partie
  const startGame = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket || !isNarrator) {
        reject(new Error('Seul le narrateur peut démarrer'));
        return;
      }

      socket.emit('start-game', { roomCode }, (response) => {
        if (response.success) {
          setGameStarted(true);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, isNarrator, roomCode]);

  // Passer à la phase suivante (narrateur)
  const nextPhase = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket || !isNarrator) {
        reject(new Error('Action non autorisée'));
        return;
      }

      socket.emit('next-phase', { roomCode }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, isNarrator, roomCode]);

  // Vote des loups
  const werewolfVote = useCallback((targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('werewolf-vote', { roomCode, targetId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Inspection de la voyante
  const seerInspect = useCallback((targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('seer-inspect', { roomCode, targetId }, (response) => {
        if (response.success) {
          setSeerResult(response.result);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Sauver avec la potion de vie
  const witchHeal = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('witch-heal', { roomCode }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Tuer avec la potion de mort
  const witchKill = useCallback((targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('witch-kill', { roomCode, targetId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Choix de Cupidon
  const cupidonChoose = useCallback((target1Id, target2Id) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('cupidon-choose', { roomCode, target1Id, target2Id }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Vote du jour
  const dayVote = useCallback((targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('day-vote', { roomCode, targetId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Action du chasseur
  const hunterKill = useCallback((targetId) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('hunter-kill', { roomCode, targetId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Envoyer un message dans le chat
  const sendChatMessage = useCallback((message, chatType) => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('send-chat-message', { roomCode, message, chatType }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Obtenir la victime de la nuit (sorcière)
  const getNightVictim = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket non connecté'));
        return;
      }

      socket.emit('get-night-victim', { roomCode }, (response) => {
        if (response.success) {
          setNightVictim(response.victim);
          setWitchPotions(response.potions);
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, roomCode]);

  // Obtenir l'état du jeu (narrateur)
  const getGameState = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!socket || !isNarrator) {
        reject(new Error('Action non autorisée'));
        return;
      }

      socket.emit('get-game-state', { roomCode }, (response) => {
        if (response.success) {
          resolve(response.gameState);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, isNarrator, roomCode]);

  // Expulser un joueur
  const kickPlayer = useCallback((playerId) => {
    return new Promise((resolve, reject) => {
      if (!socket || !isNarrator) {
        reject(new Error('Action non autorisée'));
        return;
      }

      socket.emit('kick-player', { roomCode, playerId }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }, [socket, isNarrator, roomCode]);

  // Écouter les événements
  useEffect(() => {
    if (!socket) return;

    // Joueur rejoint
    socket.on('player-joined', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    // Rôle assigné
    socket.on('role-assigned', ({ role, team, roleData: data }) => {
      setMyRole(role);
      setMyTeam(team);
      setRoleData(data);
    });

    // Partie démarrée
    socket.on('game-started', ({ phase: newPhase, players: gamePlayers, nightCount: night }) => {
      setPhase(newPhase);
      setPlayers(gamePlayers);
      setNightCount(night);
      setGameStarted(true);
    });

    // Phase changée
    socket.on('phase-changed', ({ phase: newPhase, nightCount: night, dayCount: day, deaths: newDeaths, winner: gameWinner, gameState }) => {
      setPhase(newPhase);
      setNightCount(night || 0);
      setDayCount(day || 0);
      setDeaths(newDeaths || []);
      setWinner(gameWinner);
      if (gameState) {
        setPlayers(gameState.players);
      }
      
      // Mettre à jour le statut vivant du joueur
      if (player && newDeaths) {
        const isDead = newDeaths.some(d => d.id === player.id);
        if (isDead) {
          setIsAlive(false);
        }
      }
    });

    // Votes des loups mis à jour
    socket.on('werewolf-vote-update', ({ votes }) => {
      setWerewolfVotes(votes);
    });

    // Amoureux
    socket.on('in-love', ({ partnerId }) => {
      setInLove(true);
      setLovePartner(partnerId);
    });

    // Joueur déconnecté
    socket.on('player-disconnected', ({ socketId }) => {
      setPlayers(prev => prev.map(p => 
        p.id === socketId ? { ...p, connected: false } : p
      ));
    });

    // Narrateur déconnecté
    socket.on('narrator-disconnected', () => {
      alert('Le narrateur s\'est déconnecté. La partie est terminée.');
      window.location.href = '/';
    });

    // Expulsé
    socket.on('kicked', () => {
      alert('Vous avez été expulsé de la partie.');
      window.location.href = '/';
    });

    // Joueur retiré
    socket.on('player-removed', ({ playerId }) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    // Message de chat
    socket.on('chat-message', (message) => {
      if (message.chatType === 'werewolf') {
        setWerewolfChatMessages(prev => [...prev, message]);
      } else {
        setChatMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off('player-joined');
      socket.off('role-assigned');
      socket.off('game-started');
      socket.off('phase-changed');
      socket.off('werewolf-vote-update');
      socket.off('in-love');
      socket.off('chat-message');
      socket.off('player-disconnected');
      socket.off('narrator-disconnected');
      socket.off('kicked');
      socket.off('player-removed');
    };
  }, [socket, player]);

  const value = {
    // État
    connected,
    roomCode,
    isNarrator,
    isInRoom,
    player,
    myRole,
    myTeam,
    roleData,
    isAlive,
    inLove,
    lovePartner,
    players,
    phase,
    nightCount,
    dayCount,
    gameStarted,
    deaths,
    winner,
    werewolfVotes,
    seerResult,
    witchPotions,
    nightVictim,
    chatMessages,
    werewolfChatMessages,
    
    // Actions
    createRoom,
    joinRoom,
    startGame,
    nextPhase,
    werewolfVote,
    seerInspect,
    witchHeal,
    witchKill,
    cupidonChoose,
    dayVote,
    hunterKill,
    getNightVictim,
    getGameState,
    kickPlayer,
    sendChatMessage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame doit être utilisé dans un GameProvider');
  }
  return context;
}
