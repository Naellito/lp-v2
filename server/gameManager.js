// gameManager.js - Logique complète du jeu Loup-Garou
import { PhaseManager, PHASES } from './phases.js';
import { distributeRoles, getRoleById, ROLES } from './roles.js';

export class GameManager {
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.phaseManager = new PhaseManager();
    this.players = [];
    this.actions = {
      werewolvesVote: {},
      seerChoice: null,
      witchHeal: null,
      witchKill: null,
      cupidonCouple: [],
      dayVotes: {},
      hunterKill: null,
    };
    this.couple = [];
    this.nightVictim = null;
    this.dayVictim = null;
    this.deaths = [];
    this.seerResults = [];
    this.witchPotions = { heal: true, kill: true };
    this.history = [];
    this.winner = null;
  }

  initializePlayers(playersList) {
    const roles = distributeRoles(playersList.length);
    
    this.players = playersList.map((player, index) => {
      const roleId = roles[index];
      const role = getRoleById(roleId);
      
      return {
        ...player,
        role: roleId,
        team: role.team,
        alive: true,
        connected: true,
      };
    });

    return this.players;
  }

  startGame() {
    this.phaseManager.startGame();
    this.resetNightActions();
    return {
      phase: this.phaseManager.getCurrentPhase(),
      players: this.getPublicPlayers(),
      nightCount: this.phaseManager.getNightCount(),
    };
  }

  nextPhase() {
    const previousPhase = this.phaseManager.getCurrentPhase();
    
    // Résoudre la phase actuelle avant de passer à la suivante
    this.resolvePhase(previousPhase);
    
    const newPhase = this.phaseManager.nextPhase(this.getGameState());
    
    // Log l'historique
    this.history.push({
      phase: previousPhase,
      timestamp: Date.now(),
      actions: { ...this.actions },
      deaths: [...this.deaths],
    });

    return {
      phase: newPhase,
      nightCount: this.phaseManager.getNightCount(),
      dayCount: this.phaseManager.getDayCount(),
      deaths: this.deaths,
      winner: this.winner,
    };
  }

  resolvePhase(phase) {
    switch (phase) {
      case PHASES.NIGHT_CUPIDON:
        this.resolveCupidon();
        break;
      case PHASES.NIGHT_WEREWOLVES:
        this.resolveWerewolves();
        break;
      case PHASES.NIGHT_SEER:
        // Pas de résolution, juste stockage
        break;
      case PHASES.NIGHT_WITCH:
        this.resolveWitch();
        break;
      case PHASES.DAY_INTRO:
        this.revealNightDeaths();
        break;
      case PHASES.DAY_VOTE:
        this.resolveDayVote();
        break;
      case PHASES.DAY_RESULT:
        this.checkVictoryCondition();
        break;
    }
  }

  // Actions des loups-garous
  werewolfVote(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'loup-garou' || !player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    this.actions.werewolvesVote[playerId] = targetId;
    return { success: true };
  }

  resolveWerewolves() {
    const votes = Object.values(this.actions.werewolvesVote);
    if (votes.length === 0) {
      this.nightVictim = null;
      return;
    }

    // Compter les votes
    const voteCounts = {};
    votes.forEach(targetId => {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    // Trouver la cible la plus votée
    let maxVotes = 0;
    let victim = null;
    Object.entries(voteCounts).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        victim = targetId;
      }
    });

    this.nightVictim = victim;
  }

  // Action de la voyante
  seerInspect(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'voyante' || !player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    const target = this.players.find(p => p.id === targetId);
    if (!target) {
      return { success: false, error: 'Joueur introuvable' };
    }

    this.actions.seerChoice = targetId;
    
    const result = {
      targetId: target.id,
      targetName: target.username,
      role: target.role,
      team: target.team,
    };

    this.seerResults.push(result);
    return { success: true, result };
  }

  // Actions de la sorcière
  witchHeal(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'sorciere' || !player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    if (!this.witchPotions.heal) {
      return { success: false, error: 'Potion de vie déjà utilisée' };
    }

    this.actions.witchHeal = this.nightVictim;
    this.witchPotions.heal = false;
    return { success: true, victim: this.nightVictim };
  }

  witchKill(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'sorciere' || !player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    if (!this.witchPotions.kill) {
      return { success: false, error: 'Potion de mort déjà utilisée' };
    }

    this.actions.witchKill = targetId;
    this.witchPotions.kill = false;
    return { success: true };
  }

  resolveWitch() {
    // Si la sorcière sauve, annuler la mort
    if (this.actions.witchHeal === this.nightVictim) {
      this.nightVictim = null;
    }

    // Si la sorcière tue, ajouter une victime
    if (this.actions.witchKill) {
      const witchVictim = this.players.find(p => p.id === this.actions.witchKill);
      if (witchVictim) {
        witchVictim.alive = false;
        this.deaths.push({
          id: witchVictim.id,
          username: witchVictim.username,
          role: witchVictim.role,
          cause: 'witch',
        });
      }
    }
  }

  // Action de Cupidon
  cupidonChoose(playerId, target1Id, target2Id) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'cupidon' || !player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    if (target1Id === target2Id) {
      return { success: false, error: 'Vous devez choisir deux joueurs différents' };
    }

    this.actions.cupidonCouple = [target1Id, target2Id];
    return { success: true };
  }

  resolveCupidon() {
    this.couple = this.actions.cupidonCouple;
  }

  // Révéler les morts de la nuit
  revealNightDeaths() {
    this.deaths = [];

    if (this.nightVictim) {
      const victim = this.players.find(p => p.id === this.nightVictim);
      if (victim) {
        victim.alive = false;
        this.deaths.push({
          id: victim.id,
          username: victim.username,
          role: victim.role,
          cause: 'werewolves',
        });

        // Vérifier si c'était un membre du couple
        this.checkCoupleDeaths(victim.id);
      }
    }
  }

  // Vote du jour
  dayVote(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.alive) {
      return { success: false, error: 'Vous ne pouvez pas voter' };
    }

    this.actions.dayVotes[playerId] = targetId;
    return { success: true };
  }

  resolveDayVote() {
    const votes = Object.values(this.actions.dayVotes);
    if (votes.length === 0) {
      this.dayVictim = null;
      return;
    }

    // Compter les votes
    const voteCounts = {};
    votes.forEach(targetId => {
      if (targetId) { // Ignorer les votes blancs (null)
        voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
      }
    });

    // Trouver le joueur le plus voté
    let maxVotes = 0;
    let victim = null;
    Object.entries(voteCounts).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        victim = targetId;
      }
    });

    if (victim) {
      const victimPlayer = this.players.find(p => p.id === victim);
      if (victimPlayer) {
        victimPlayer.alive = false;
        this.deaths.push({
          id: victimPlayer.id,
          username: victimPlayer.username,
          role: victimPlayer.role,
          cause: 'vote',
        });

        this.dayVictim = victim;

        // Vérifier le chasseur
        if (victimPlayer.role === 'chasseur') {
          // Le chasseur peut tuer quelqu'un
          // Cette action sera gérée séparément
        }

        // Vérifier le couple
        this.checkCoupleDeaths(victim);
      }
    }
  }

  // Action du chasseur
  hunterKill(playerId, targetId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.role !== 'chasseur' || player.alive) {
      return { success: false, error: 'Action non autorisée' };
    }

    const target = this.players.find(p => p.id === targetId);
    if (!target || !target.alive) {
      return { success: false, error: 'Cible invalide' };
    }

    target.alive = false;
    this.deaths.push({
      id: target.id,
      username: target.username,
      role: target.role,
      cause: 'hunter',
    });

    this.actions.hunterKill = targetId;
    this.checkCoupleDeaths(targetId);

    return { success: true };
  }

  // Vérifier les morts du couple
  checkCoupleDeaths(deadPlayerId) {
    if (this.couple.length === 2 && this.couple.includes(deadPlayerId)) {
      const otherLoverId = this.couple.find(id => id !== deadPlayerId);
      const otherLover = this.players.find(p => p.id === otherLoverId);
      
      if (otherLover && otherLover.alive) {
        otherLover.alive = false;
        this.deaths.push({
          id: otherLover.id,
          username: otherLover.username,
          role: otherLover.role,
          cause: 'love',
        });
      }
    }
  }

  // Vérifier les conditions de victoire
  checkVictoryCondition() {
    this.winner = this.phaseManager.checkVictory(this.getGameState());
    return this.winner;
  }

  // Réinitialiser les actions de la nuit
  resetNightActions() {
    this.actions = {
      werewolvesVote: {},
      seerChoice: null,
      witchHeal: null,
      witchKill: null,
      cupidonCouple: [],
      dayVotes: {},
      hunterKill: null,
    };
    this.nightVictim = null;
    this.dayVictim = null;
    this.deaths = [];
  }

  resetDayActions() {
    this.actions.dayVotes = {};
    this.dayVictim = null;
  }

  getGameState() {
    return {
      phase: this.phaseManager.getCurrentPhase(),
      players: this.players,
      nightCount: this.phaseManager.getNightCount(),
      dayCount: this.phaseManager.getDayCount(),
      couple: this.couple,
      deaths: this.deaths,
      winner: this.winner,
      witchPotions: this.witchPotions,
    };
  }

  getPublicPlayers() {
    return this.players.map(p => ({
      id: p.id,
      username: p.username,
      alive: p.alive,
      connected: p.connected,
    }));
  }

  getPlayerRole(playerId) {
    const player = this.players.find(p => p.id === playerId);
    return player ? {
      role: player.role,
      team: player.team,
      roleData: getRoleById(player.role),
    } : null;
  }

  getNightVictim() {
    return this.nightVictim;
  }

  getVoteResults() {
    return {
      werewolvesVote: this.actions.werewolvesVote,
      dayVotes: this.actions.dayVotes,
    };
  }

  isPlayerInCouple(playerId) {
    return this.couple.includes(playerId);
  }

  getCouplePartner(playerId) {
    if (!this.isPlayerInCouple(playerId)) return null;
    return this.couple.find(id => id !== playerId);
  }
}
