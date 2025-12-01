// roles.js - Définition des rôles et leurs capacités
export const ROLES = {
  VILLAGEOIS: {
    id: 'villageois',
    name: 'Villageois',
    team: 'village',
    description: 'Un simple villageois. Votre objectif est d\'éliminer tous les loups-garous.',
    nightAction: false,
    wakeOrder: null,
    power: null,
  },
  LOUP_GAROU: {
    id: 'loup-garou',
    name: 'Loup-Garou',
    team: 'werewolves',
    description: 'Vous êtes un loup-garou. Chaque nuit, choisissez une victime avec vos compagnons loups.',
    nightAction: true,
    wakeOrder: 1,
    power: 'kill',
  },
  VOYANTE: {
    id: 'voyante',
    name: 'Voyante',
    team: 'village',
    description: 'Chaque nuit, vous pouvez voir le rôle d\'un joueur.',
    nightAction: true,
    wakeOrder: 2,
    power: 'see',
  },
  SORCIERE: {
    id: 'sorciere',
    name: 'Sorcière',
    team: 'village',
    description: 'Vous possédez 2 potions : une pour sauver et une pour tuer. Chacune utilisable une seule fois.',
    nightAction: true,
    wakeOrder: 3,
    power: 'heal_or_kill',
    potions: {
      heal: true,
      kill: true,
    },
  },
  CUPIDON: {
    id: 'cupidon',
    name: 'Cupidon',
    team: 'village',
    description: 'La première nuit, vous formez un couple. Si l\'un meurt, l\'autre meurt aussi.',
    nightAction: true,
    wakeOrder: 0, // Se réveille en premier, première nuit seulement
    power: 'couple',
    oneTime: true,
  },
  CHASSEUR: {
    id: 'chasseur',
    name: 'Chasseur',
    team: 'village',
    description: 'Lorsque vous mourrez, vous pouvez éliminer un joueur de votre choix.',
    nightAction: false,
    wakeOrder: null,
    power: 'revenge_kill',
    onDeath: true,
  },
};

export function getRoleById(roleId) {
  return Object.values(ROLES).find(role => role.id === roleId);
}

export function getTeamRoles(team) {
  return Object.values(ROLES).filter(role => role.team === team);
}

export function getNightRoles() {
  return Object.values(ROLES)
    .filter(role => role.nightAction)
    .sort((a, b) => a.wakeOrder - b.wakeOrder);
}

export function distributeRoles(playerCount) {
  const roleDistribution = [];
  
  if (playerCount < 4) {
    throw new Error('Minimum 4 joueurs requis');
  }

  // Configuration selon nombre de joueurs
  if (playerCount >= 4 && playerCount <= 6) {
    roleDistribution.push(
      ROLES.LOUP_GAROU.id,
      ROLES.LOUP_GAROU.id,
      ROLES.VOYANTE.id,
      ROLES.VILLAGEOIS.id
    );
    for (let i = 4; i < playerCount; i++) {
      roleDistribution.push(ROLES.VILLAGEOIS.id);
    }
  } else if (playerCount >= 7 && playerCount <= 10) {
    roleDistribution.push(
      ROLES.LOUP_GAROU.id,
      ROLES.LOUP_GAROU.id,
      ROLES.VOYANTE.id,
      ROLES.SORCIERE.id,
      ROLES.CHASSEUR.id,
      ROLES.CUPIDON.id
    );
    for (let i = 6; i < playerCount; i++) {
      roleDistribution.push(ROLES.VILLAGEOIS.id);
    }
  } else {
    // Plus de 10 joueurs : ajouter un 3ème loup
    roleDistribution.push(
      ROLES.LOUP_GAROU.id,
      ROLES.LOUP_GAROU.id,
      ROLES.LOUP_GAROU.id,
      ROLES.VOYANTE.id,
      ROLES.SORCIERE.id,
      ROLES.CHASSEUR.id,
      ROLES.CUPIDON.id
    );
    for (let i = 7; i < playerCount; i++) {
      roleDistribution.push(ROLES.VILLAGEOIS.id);
    }
  }

  // Mélanger les rôles
  return roleDistribution.sort(() => Math.random() - 0.5);
}
