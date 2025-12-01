// PlayerCard.jsx - Carte pour afficher un joueur
import { motion } from 'framer-motion';

export function PlayerCard({ player, onClick, selected = false, showRole = false, isDead = false, disconnected = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${selected ? 'border-yellow-400 bg-yellow-900/30 shadow-lg shadow-yellow-500/50' : 'border-gray-700 bg-gray-800/50'}
        ${isDead ? 'opacity-50 grayscale' : ''}
        ${disconnected ? 'opacity-40' : ''}
      `}
    >
      {/* Badge mort */}
      {isDead && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          💀 MORT
        </div>
      )}

      {/* Badge déconnecté */}
      {disconnected && (
        <div className="absolute -top-2 -left-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          ⚠️ DÉCO
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
          {player.username?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-bold text-white">{player.username || 'Inconnu'}</h3>
          {showRole && player.role && (
            <p className="text-sm text-gray-400">
              {getRoleEmoji(player.role)} {getRoleName(player.role)}
            </p>
          )}
          {isDead && (
            <p className="text-xs text-red-400 mt-1">
              {player.cause ? getCauseText(player.cause) : 'Éliminé'}
            </p>
          )}
        </div>

        {/* Indicateur de sélection */}
        {selected && (
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-black font-bold">✓</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getRoleEmoji(roleId) {
  const emojis = {
    'loup-garou': '🐺',
    'voyante': '🔮',
    'sorciere': '🧪',
    'cupidon': '💘',
    'chasseur': '🎯',
    'villageois': '👤',
  };
  return emojis[roleId] || '👤';
}

function getRoleName(roleId) {
  const names = {
    'loup-garou': 'Loup-Garou',
    'voyante': 'Voyante',
    'sorciere': 'Sorcière',
    'cupidon': 'Cupidon',
    'chasseur': 'Chasseur',
    'villageois': 'Villageois',
  };
  return names[roleId] || roleId;
}

function getCauseText(cause) {
  const texts = {
    werewolves: 'Dévoré par les loups',
    vote: 'Éliminé par le village',
    witch: 'Empoisonné par la sorcière',
    hunter: 'Tué par le chasseur',
    love: 'Mort de chagrin',
  };
  return texts[cause] || 'Décédé';
}
