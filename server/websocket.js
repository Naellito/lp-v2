// websocket.js - Gestion des WebSockets et communication temps réel
import { Server } from 'socket.io';
import { RoomManager } from './roomManager.js';
import { GameManager } from './gameManager.js';

const roomManager = new RoomManager();
const games = new Map(); // Map<roomCode, GameManager>

export function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connecté: ${socket.id}`);

    // Créer une room
    socket.on('create-room', (callback) => {
      try {
        const room = roomManager.createRoom(socket.id);
        socket.join(room.code);
        
        console.log(`Room créée: ${room.code} par ${socket.id}`);
        
        callback({
          success: true,
          roomCode: room.code,
          isNarrator: true,
        });
      } catch (error) {
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    // Rejoindre une room
    socket.on('join-room', ({ roomCode, username }, callback) => {
      try {
        const upperRoomCode = roomCode.toUpperCase();
        
        if (!roomManager.roomExists(upperRoomCode)) {
          return callback({
            success: false,
            error: 'Cette partie n\'existe pas',
          });
        }

        const room = roomManager.getRoom(upperRoomCode);
        
        if (room.started) {
          return callback({
            success: false,
            error: 'La partie a déjà commencé',
          });
        }

        const player = roomManager.addPlayer(upperRoomCode, {
          socketId: socket.id,
          username,
        });

        socket.join(upperRoomCode);
        
        // Notifier tous les joueurs
        io.to(upperRoomCode).emit('player-joined', {
          player: {
            id: player.id,
            username: player.username,
            connected: true,
          },
          players: room.players.map(p => ({
            id: p.id,
            username: p.username,
            connected: p.connected,
          })),
        });

        console.log(`${username} a rejoint la room ${upperRoomCode}`);

        callback({
          success: true,
          roomCode: upperRoomCode,
          player,
          players: room.players,
        });
      } catch (error) {
        callback({
          success: false,
          error: error.message,
        });
      }
    });

    // Lancer la partie
    socket.on('start-game', ({ roomCode }, callback) => {
      try {
        const room = roomManager.getRoom(roomCode);
        
        if (!room) {
          return callback({ success: false, error: 'Room introuvable' });
        }

        if (!roomManager.isNarrator(roomCode, socket.id)) {
          return callback({ success: false, error: 'Seul le narrateur peut démarrer' });
        }

        if (room.players.length < 4) {
          return callback({ success: false, error: 'Minimum 4 joueurs requis' });
        }

        // Créer le game manager
        const game = new GameManager(roomCode);
        const players = game.initializePlayers(room.players);
        games.set(roomCode, game);

        room.started = true;

        // Envoyer les rôles à chaque joueur
        players.forEach(player => {
          io.to(player.socketId).emit('role-assigned', {
            role: player.role,
            team: player.team,
            roleData: game.getPlayerRole(player.id).roleData,
          });
        });

        // Démarrer le jeu
        const gameState = game.startGame();

        // Notifier tout le monde
        io.to(roomCode).emit('game-started', {
          phase: gameState.phase,
          players: gameState.players,
          nightCount: gameState.nightCount,
        });

        console.log(`Partie démarrée dans ${roomCode}`);

        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Phase suivante (narrateur uniquement)
    socket.on('next-phase', ({ roomCode }, callback) => {
      try {
        const game = games.get(roomCode);
        
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        if (!roomManager.isNarrator(roomCode, socket.id)) {
          return callback({ success: false, error: 'Action non autorisée' });
        }

        const result = game.nextPhase();
        const gameState = game.getGameState();

        // Si la phase suivante est la nuit, réinitialiser les actions
        if (result.phase === 'night_intro') {
          game.resetNightActions();
        }

        // Si c'est le jour, réinitialiser les votes
        if (result.phase === 'day_discussion') {
          game.resetDayActions();
        }

        io.to(roomCode).emit('phase-changed', {
          phase: result.phase,
          nightCount: result.nightCount,
          dayCount: result.dayCount,
          deaths: result.deaths,
          winner: result.winner,
          gameState: {
            ...gameState,
            players: game.getPublicPlayers(),
          },
        });

        callback({ success: true, phase: result.phase });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Vote des loups
    socket.on('werewolf-vote', ({ roomCode, targetId }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.werewolfVote(player.id, targetId);
        
        if (result.success) {
          // Notifier les autres loups
          const werewolves = game.players.filter(p => p.role === 'loup-garou' && p.alive);
          werewolves.forEach(wolf => {
            io.to(wolf.socketId).emit('werewolf-vote-update', {
                votes: game.actions.werewolvesVote,
            });
          });
        }

        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Action de la voyante
    socket.on('seer-inspect', ({ roomCode, targetId }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.seerInspect(player.id, targetId);
        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Actions de la sorcière
    socket.on('witch-heal', ({ roomCode }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.witchHeal(player.id);
        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('witch-kill', ({ roomCode, targetId }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.witchKill(player.id, targetId);
        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Action de Cupidon
    socket.on('cupidon-choose', ({ roomCode, target1Id, target2Id }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.cupidonChoose(player.id, target1Id, target2Id);
        
        if (result.success) {
          // Notifier les amoureux
          io.to(target1Id).emit('in-love', { partnerId: target2Id });
          io.to(target2Id).emit('in-love', { partnerId: target1Id });
        }

        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Vote du jour
    socket.on('day-vote', ({ roomCode, targetId }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.dayVote(player.id, targetId);
        
        if (result.success) {
          // Notifier le narrateur des votes
          io.to(room.narratorId).emit('vote-update', {
            votes: game.actions.dayVotes,
          });
        }

        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Action du chasseur
    socket.on('hunter-kill', ({ roomCode, targetId }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        const result = game.hunterKill(player.id, targetId);
        
        if (result.success) {
          io.to(roomCode).emit('hunter-revenge', {
            hunterId: player.id,
            targetId,
          });
        }

        callback(result);
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Obtenir l'état du jeu (narrateur)
    socket.on('get-game-state', ({ roomCode }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        if (!roomManager.isNarrator(roomCode, socket.id)) {
          return callback({ success: false, error: 'Action non autorisée' });
        }

        const gameState = game.getGameState();
        callback({
          success: true,
          gameState: {
            ...gameState,
            actions: game.actions,
            nightVictim: game.getNightVictim(),
            voteResults: game.getVoteResults(),
          },
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Obtenir la victime de la nuit (pour la sorcière)
    socket.on('get-night-victim', ({ roomCode }, callback) => {
      try {
        const game = games.get(roomCode);
        if (!game) {
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const room = roomManager.getRoom(roomCode);
        const player = room.players.find(p => p.socketId === socket.id);

        if (player.role !== 'sorciere') {
          return callback({ success: false, error: 'Action non autorisée' });
        }

        const victimId = game.getNightVictim();
        const victim = victimId ? game.players.find(p => p.id === victimId) : null;

        callback({
          success: true,
          victim: victim ? {
            id: victim.id,
            username: victim.username,
          } : null,
          potions: game.witchPotions,
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`Client déconnecté: ${socket.id}`);
      
      const roomData = roomManager.getRoomBySocketId(socket.id);
      
      if (roomData) {
        const { code, room } = roomData;
        
        // Si c'est le narrateur
        if (room.narratorId === socket.id) {
          io.to(code).emit('narrator-disconnected');
          games.delete(code);
          roomManager.deleteRoom(code);
          console.log(`Room ${code} supprimée (narrateur déconnecté)`);
        } else {
          // Si c'est un joueur
          roomManager.updatePlayerConnection(code, socket.id, false);
          io.to(code).emit('player-disconnected', { socketId: socket.id });
        }
      }
    });

    // Expulser un joueur (narrateur)
    socket.on('kick-player', ({ roomCode, playerId }, callback) => {
      try {
        if (!roomManager.isNarrator(roomCode, socket.id)) {
          return callback({ success: false, error: 'Action non autorisée' });
        }

        const removed = roomManager.removePlayer(roomCode, playerId);
        
        if (removed) {
          io.to(playerId).emit('kicked');
          io.to(roomCode).emit('player-removed', { playerId });
        }

        callback({ success: removed });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Chat - Envoyer un message
    socket.on('send-chat-message', ({ roomCode, message, chatType }, callback) => {
      try {
        console.log(`💬 Message reçu: "${message}" de type ${chatType} dans room ${roomCode}`);
        
        const room = roomManager.getRoom(roomCode);
        if (!room) {
          console.log(`❌ Room ${roomCode} introuvable`);
          return callback({ success: false, error: 'Partie introuvable' });
        }

        const player = room.players.find(p => p.socketId === socket.id);
        if (!player) {
          console.log(`❌ Joueur introuvable dans room ${roomCode}`);
          return callback({ success: false, error: 'Joueur introuvable' });
        }

        const game = games.get(roomCode);
        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        const chatMessage = {
          id: Date.now(),
          playerId: player.id,
          username: player.username,
          text: message,
          time,
          chatType,
          phase: game?.phase || 'lobby',
        };

        // Obtenir l'emoji selon le type de chat et le rôle
        if (game) {
          const gamePlayer = game.players.find(p => p.id === player.id);
          
          if (chatType === 'werewolf' && gamePlayer?.role === 'loup-garou') {
            // Dans le chat des loups, les loups ont leur emoji
            chatMessage.playerEmoji = '🐺';
          } else if (chatType === 'general') {
            // Dans le chat général, tout le monde a l'emoji villageois (pour cacher les rôles)
            chatMessage.playerEmoji = '👤';
          }
        } else {
          // Avant le démarrage du jeu (lobby)
          chatMessage.playerEmoji = '👤';
        }

        // Envoyer le message aux bonnes personnes
        if (chatType === 'werewolf') {
          // Chat des loups : envoyer uniquement aux loups
          if (game) {
            const werewolves = game.players.filter(p => p.role === 'loup-garou');
            console.log(`🐺 Envoi aux ${werewolves.length} loups`);
            werewolves.forEach(wolf => {
              const wolfPlayer = room.players.find(p => p.id === wolf.id);
              if (wolfPlayer) {
                io.to(wolfPlayer.socketId).emit('chat-message', chatMessage);
              }
            });
          }
        } else {
          // Chat général : envoyer à tout le monde sauf au narrateur
          console.log(`💬 Envoi à ${room.players.length} joueurs`);
          room.players.forEach(p => {
            io.to(p.socketId).emit('chat-message', chatMessage);
          });
        }

        console.log(`✅ Message envoyé avec succès`);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Chat - Message système
    socket.on('send-system-message', ({ roomCode, message, chatType }) => {
      try {
        const room = roomManager.getRoom(roomCode);
        if (!room) return;

        const now = new Date();
        const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        const systemMessage = {
          id: Date.now(),
          text: message,
          time,
          chatType,
          isSystem: true,
        };

        if (chatType === 'werewolf') {
          const game = games.get(roomCode);
          if (game) {
            const werewolves = game.players.filter(p => p.role === 'loup-garou');
            werewolves.forEach(wolf => {
              const wolfPlayer = room.players.find(p => p.id === wolf.id);
              if (wolfPlayer) {
                io.to(wolfPlayer.socketId).emit('chat-message', systemMessage);
              }
            });
          }
        } else {
          room.players.forEach(p => {
            io.to(p.socketId).emit('chat-message', systemMessage);
          });
        }
      } catch (error) {
        console.error('Erreur message système:', error);
      }
    });
  });

  // Nettoyage périodique
  setInterval(() => {
    roomManager.cleanupOldRooms();
  }, 60 * 60 * 1000); // Toutes les heures

  return io;
}
