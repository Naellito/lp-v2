// GameStatus.jsx - Affichage du statut de la partie
import { motion } from 'framer-motion';

export function GameStatus({ phase, nightCount, dayCount, playersAlive, totalPlayers }) {
  const getPhaseInfo = (currentPhase) => {
    switch (currentPhase) {
      case 'lobby':
        return { icon: '⏳', text: 'En attente', color: 'text-gray-400' };
      case 'night_intro':
      case 'night_cupidon':
      case 'night_werewolves':
      case 'night_seer':
      case 'night_witch':
        return { icon: '🌙', text: `Nuit ${nightCount}`, color: 'text-blue-400' };
      case 'day_intro':
      case 'day_discussion':
      case 'day_vote':
      case 'day_result':
        return { icon: '☀️', text: `Jour ${dayCount}`, color: 'text-yellow-400' };
      case 'game_over':
        return { icon: '🏆', text: 'Terminé', color: 'text-green-400' };
      default:
        return { icon: '❓', text: 'Inconnu', color: 'text-gray-400' };
    }
  };

  const phaseInfo = getPhaseInfo(phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 shadow-xl border border-gray-700"
    >
      <div className="flex items-center justify-between">
        {/* Phase actuelle */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{phaseInfo.icon}</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Phase actuelle</p>
            <p className={`text-xl font-bold ${phaseInfo.color}`}>
              {phaseInfo.text}
            </p>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-12 w-px bg-gray-700 mx-4" />

        {/* Joueurs vivants */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">👥</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Joueurs</p>
            <p className="text-xl font-bold text-white">
              {playersAlive} / {totalPlayers}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
