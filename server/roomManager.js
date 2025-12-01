// roomManager.js - Gestion des rooms et joueurs
import { nanoid } from 'nanoid';

export class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(narratorSocketId) {
    const roomCode = this.generateRoomCode();
    const room = {
      code: roomCode,
      narratorId: narratorSocketId,
      players: [],
      createdAt: Date.now(),
      started: false,
    };
    
    this.rooms.set(roomCode, room);
    return room;
  }

  generateRoomCode() {
    // Générer un code à 5 caractères
    let code;
    do {
      code = nanoid(5).toUpperCase();
    } while (this.rooms.has(code));
    return code;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode.toUpperCase());
  }

  roomExists(roomCode) {
    return this.rooms.has(roomCode.toUpperCase());
  }

  addPlayer(roomCode, player) {
    const room = this.getRoom(roomCode);
    if (!room) return null;

    // Vérifier si le pseudo est déjà pris
    if (room.players.some(p => p.username === player.username)) {
      throw new Error('Ce pseudo est déjà utilisé dans cette partie');
    }

    const newPlayer = {
      id: player.socketId,
      socketId: player.socketId,
      username: player.username,
      role: null,
      team: null,
      alive: true,
      connected: true,
      joinedAt: Date.now(),
    };

    room.players.push(newPlayer);
    return newPlayer;
  }

  removePlayer(roomCode, socketId) {
    const room = this.getRoom(roomCode);
    if (!room) return false;

    const playerIndex = room.players.findIndex(p => p.socketId === socketId);
    if (playerIndex === -1) return false;

    room.players.splice(playerIndex, 1);

    // Supprimer la room si vide
    if (room.players.length === 0 && room.narratorId !== socketId) {
      this.rooms.delete(roomCode);
    }

    return true;
  }

  getPlayer(roomCode, socketId) {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    return room.players.find(p => p.socketId === socketId);
  }

  updatePlayerConnection(roomCode, socketId, connected) {
    const player = this.getPlayer(roomCode, socketId);
    if (player) {
      player.connected = connected;
    }
  }

  isNarrator(roomCode, socketId) {
    const room = this.getRoom(roomCode);
    return room && room.narratorId === socketId;
  }

  deleteRoom(roomCode) {
    return this.rooms.delete(roomCode.toUpperCase());
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getRoomBySocketId(socketId) {
    for (const [code, room] of this.rooms) {
      if (room.narratorId === socketId || room.players.some(p => p.socketId === socketId)) {
        return { code, room };
      }
    }
    return null;
  }

  cleanupOldRooms() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [code, room] of this.rooms) {
      if (now - room.createdAt > maxAge) {
        this.rooms.delete(code);
      }
    }
  }
}
