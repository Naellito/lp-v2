// constants.js - Constantes et utilitaires
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

export const ROLES = {
  VILLAGEOIS: 'villageois',
  LOUP_GAROU: 'loup-garou',
  VOYANTE: 'voyante',
  SORCIERE: 'sorciere',
  CUPIDON: 'cupidon',
  CHASSEUR: 'chasseur',
};

export function formatTimeLeft(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

export function getRoleColor(roleId) {
  switch (roleId) {
    case ROLES.LOUP_GAROU:
      return 'text-red-500';
    case ROLES.VOYANTE:
      return 'text-purple-500';
    case ROLES.SORCIERE:
      return 'text-green-500';
    case ROLES.CUPIDON:
      return 'text-pink-500';
    case ROLES.CHASSEUR:
      return 'text-orange-500';
    case ROLES.VILLAGEOIS:
    default:
      return 'text-blue-500';
  }
}

export function getTeamColor(team) {
  return team === 'werewolves' ? 'text-red-500' : 'text-blue-500';
}

export function isNightPhase(phase) {
  return phase.startsWith('night_');
}

export function isDayPhase(phase) {
  return phase.startsWith('day_');
}
