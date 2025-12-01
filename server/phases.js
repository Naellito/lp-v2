// phases.js - Gestion des phases du jeu
export const PHASES = {
  LOBBY: 'lobby',
  NIGHT_INTRO: 'night_intro',
  NIGHT_CUPIDON: 'night_cupidon',
  NIGHT_WEREWOLVES: 'night_werewolves',
  NIGHT_SEER: 'night_seer',
  NIGHT_WITCH: 'night_witch',
  DAY_INTRO: 'day_intro',
  DAY_DISCUSSION: 'day_discussion',
  DAY_VOTE: 'day_vote',
  DAY_RESULT: 'day_result',
  GAME_OVER: 'game_over',
};

export const PHASE_DURATIONS = {
  [PHASES.NIGHT_INTRO]: 5000,
  [PHASES.NIGHT_CUPIDON]: 30000,
  [PHASES.NIGHT_WEREWOLVES]: 45000,
  [PHASES.NIGHT_SEER]: 30000,
  [PHASES.NIGHT_WITCH]: 45000,
  [PHASES.DAY_INTRO]: 8000,
  [PHASES.DAY_DISCUSSION]: 0, // Contrôlé par le narrateur
  [PHASES.DAY_VOTE]: 60000,
  [PHASES.DAY_RESULT]: 10000,
};

export class PhaseManager {
  constructor() {
    this.currentPhase = PHASES.LOBBY;
    this.nightCount = 0;
    this.dayCount = 0;
    this.cupidonUsed = false;
  }

  startGame() {
    this.currentPhase = PHASES.NIGHT_INTRO;
    this.nightCount = 1;
    return this.currentPhase;
  }

  nextPhase(gameState) {
    switch (this.currentPhase) {
      case PHASES.LOBBY:
        this.nightCount = 1;
        return this.currentPhase = PHASES.NIGHT_INTRO;

      case PHASES.NIGHT_INTRO:
        // Première nuit : Cupidon si présent et pas encore utilisé
        if (!this.cupidonUsed && this.hasCupidon(gameState)) {
          return this.currentPhase = PHASES.NIGHT_CUPIDON;
        }
        return this.currentPhase = PHASES.NIGHT_WEREWOLVES;

      case PHASES.NIGHT_CUPIDON:
        this.cupidonUsed = true;
        return this.currentPhase = PHASES.NIGHT_WEREWOLVES;

      case PHASES.NIGHT_WEREWOLVES:
        if (this.hasSeer(gameState)) {
          return this.currentPhase = PHASES.NIGHT_SEER;
        }
        if (this.hasWitch(gameState)) {
          return this.currentPhase = PHASES.NIGHT_WITCH;
        }
        return this.currentPhase = PHASES.DAY_INTRO;

      case PHASES.NIGHT_SEER:
        if (this.hasWitch(gameState)) {
          return this.currentPhase = PHASES.NIGHT_WITCH;
        }
        return this.currentPhase = PHASES.DAY_INTRO;

      case PHASES.NIGHT_WITCH:
        return this.currentPhase = PHASES.DAY_INTRO;

      case PHASES.DAY_INTRO:
        this.dayCount++;
        return this.currentPhase = PHASES.DAY_DISCUSSION;

      case PHASES.DAY_DISCUSSION:
        return this.currentPhase = PHASES.DAY_VOTE;

      case PHASES.DAY_VOTE:
        return this.currentPhase = PHASES.DAY_RESULT;

      case PHASES.DAY_RESULT:
        // Vérifier victoire avant de passer à la nuit
        const winner = this.checkVictory(gameState);
        if (winner) {
          return this.currentPhase = PHASES.GAME_OVER;
        }
        this.nightCount++;
        return this.currentPhase = PHASES.NIGHT_INTRO;

      case PHASES.GAME_OVER:
        return this.currentPhase;

      default:
        return this.currentPhase;
    }
  }

  hasCupidon(gameState) {
    return gameState.players.some(p => p.role === 'cupidon' && p.alive);
  }

  hasSeer(gameState) {
    return gameState.players.some(p => p.role === 'voyante' && p.alive);
  }

  hasWitch(gameState) {
    return gameState.players.some(p => p.role === 'sorciere' && p.alive);
  }

  checkVictory(gameState) {
    const alivePlayers = gameState.players.filter(p => p.alive);
    const aliveWerewolves = alivePlayers.filter(p => p.team === 'werewolves');
    const aliveVillagers = alivePlayers.filter(p => p.team === 'village');

    if (aliveWerewolves.length === 0) {
      return 'village';
    }

    if (aliveWerewolves.length >= aliveVillagers.length) {
      return 'werewolves';
    }

    return null;
  }

  reset() {
    this.currentPhase = PHASES.LOBBY;
    this.nightCount = 0;
    this.dayCount = 0;
    this.cupidonUsed = false;
  }

  getCurrentPhase() {
    return this.currentPhase;
  }

  getNightCount() {
    return this.nightCount;
  }

  getDayCount() {
    return this.dayCount;
  }
}
