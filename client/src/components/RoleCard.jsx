// RoleCard.jsx - Carte pour afficher le rôle du joueur avec animation spectaculaire
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function RoleCard({ role, team, roleData, showDetails = true }) {
  const [flipped, setFlipped] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Animation d'entrée avec délai
    setTimeout(() => setShowCard(true), 500);

    // Générer des particules
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const getRoleColor = (roleId) => {
    if (roleId === 'loup-garou') return 'from-red-900 via-red-700 to-black';
    if (roleId === 'voyante') return 'from-purple-900 via-blue-800 to-indigo-900';
    if (roleId === 'sorciere') return 'from-green-900 via-emerald-800 to-teal-900';
    if (roleId === 'cupidon') return 'from-pink-900 via-rose-800 to-purple-900';
    if (roleId === 'chasseur') return 'from-orange-900 via-amber-800 to-yellow-900';
    return 'from-gray-800 via-slate-700 to-gray-900';
  };

  const getRoleShadow = (roleId) => {
    if (roleId === 'loup-garou') return 'shadow-[0_0_50px_rgba(239,68,68,0.8)]';
    if (roleId === 'voyante') return 'shadow-[0_0_50px_rgba(147,51,234,0.8)]';
    if (roleId === 'sorciere') return 'shadow-[0_0_50px_rgba(16,185,129,0.8)]';
    if (roleId === 'cupidon') return 'shadow-[0_0_50px_rgba(236,72,153,0.8)]';
    if (roleId === 'chasseur') return 'shadow-[0_0_50px_rgba(245,158,11,0.8)]';
    return 'shadow-[0_0_30px_rgba(100,116,139,0.6)]';
  };

  const getRoleEmoji = (roleId) => {
    const emojis = {
      'loup-garou': '🐺',
      'voyante': '🔮',
      'sorciere': '🧪',
      'cupidon': '💘',
      'chasseur': '🎯',
      'villageois': '👤',
    };
    return emojis[roleId] || '👤';
  };

  const getRoleParticleColor = (roleId) => {
    if (roleId === 'loup-garou') return 'bg-red-500';
    if (roleId === 'voyante') return 'bg-purple-500';
    if (roleId === 'sorciere') return 'bg-green-500';
    if (roleId === 'cupidon') return 'bg-pink-500';
    if (roleId === 'chasseur') return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <motion.div 
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Particules d'ambiance */}
      <AnimatePresence mode="wait">
        {showCard && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${getRoleParticleColor(role)} opacity-60`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 0.8, 0],
              y: [0, -100],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Cercles lumineux qui pulsent */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full ${getRoleShadow(role)} opacity-30`}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute w-72 h-72 rounded-full ${getRoleShadow(role)} opacity-40`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Carte principale avec 2 faces distinctes */}
      <AnimatePresence mode="wait">
        {showCard && !flipped && (
          <motion.div
            key="front"
            className="relative z-10"
            initial={{ 
              scale: 0,
              rotateY: 180,
              opacity: 0,
            }}
            animate={{ 
              scale: 1,
              rotateY: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0.8,
              rotateY: -90,
              opacity: 0,
            }}
            transition={{ 
              scale: { duration: 1, type: "spring", bounce: 0.5 },
              rotateY: { duration: 0.4 },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              className={`
                w-full max-w-lg mx-auto p-10 rounded-3xl border-4 border-yellow-500
                bg-gradient-to-br ${getRoleColor(role)} ${getRoleShadow(role)}
                cursor-pointer relative overflow-hidden
              `}
              onClick={() => setFlipped(true)}
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Effet de brillance qui traverse la carte */}
              <motion.div
                className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "linear",
                }}
              />

              {/* Face avant */}
              <div>
                <div className="text-center relative">
                  {/* Emoji avec animation */}
                  <motion.div 
                    className="text-9xl mb-6 filter drop-shadow-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotateZ: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {getRoleEmoji(role)}
                  </motion.div>

                  {/* Titre avec effet néon */}
                  <motion.h2 
                    className="text-5xl font-bold text-yellow-400 mb-4 tracking-wider"
                    style={{
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.5)',
                    }}
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.8)',
                        '0 0 40px rgba(251, 191, 36, 1)',
                        '0 0 20px rgba(251, 191, 36, 0.8)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {roleData?.name || role}
                  </motion.h2>

                  {/* Badge équipe */}
                  <motion.div 
                    className="inline-block px-6 py-3 bg-black/50 rounded-full mb-6 border-2 border-yellow-500/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                  >
                    <span className="text-lg font-semibold uppercase tracking-wider text-yellow-300">
                      {team === 'werewolves' ? '🐺 Loups-Garous' : '🏘️ Village'}
                    </span>
                  </motion.div>
                  
                  {/* Description */}
                  {showDetails && roleData?.description && (
                    <motion.p 
                      className="text-gray-200 text-base mt-6 leading-relaxed px-4 bg-black/30 py-4 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      {roleData.description}
                    </motion.p>
                  )}

                  {/* Indicateur de retournement */}
                  <motion.div 
                    className="mt-8 text-sm text-yellow-500 font-semibold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Cliquez pour voir votre mission ✨
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Face arrière - Carte séparée */}
        {showCard && flipped && (
          <motion.div
            key="back"
            className="relative z-10"
            initial={{ 
              scale: 0.8,
              rotateY: 90,
              opacity: 0,
            }}
            animate={{ 
              scale: 1,
              rotateY: 0,
              opacity: 1,
            }}
            exit={{
              scale: 0.8,
              rotateY: 90,
              opacity: 0,
            }}
            transition={{ 
              scale: { duration: 0.5, type: "spring", bounce: 0.5 },
              rotateY: { duration: 0.4 },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              className={`
                w-full max-w-lg mx-auto p-10 rounded-3xl border-4 border-yellow-500
                bg-gradient-to-br ${getRoleColor(role)} ${getRoleShadow(role)}
                cursor-pointer relative overflow-hidden
              `}
              onClick={() => setFlipped(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Effet de brillance */}
              <motion.div
                className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "linear",
                }}
              />

              <div className="text-center">
                <motion.h3 
                  className="text-4xl font-bold text-yellow-400 mb-6"
                  style={{
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.8)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                >
                  ⚔️ Votre Mission ⚔️
                </motion.h3>
                
                {team === 'werewolves' ? (
                  <div className="space-y-6">
                    <motion.p 
                      className="text-red-300 text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                    >
                      🐺 Éliminez tous les villageois
                    </motion.p>
                    <motion.div
                      className="text-gray-200 text-base bg-black/40 p-6 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="mb-3">🌙 Chaque nuit, désignez une victime avec vos compagnons loups.</p>
                      <p>☀️ Restez discret le jour pour ne pas être démasqué.</p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <motion.p 
                      className="text-blue-300 text-2xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                    >
                      🏘️ Éliminez tous les loups-garous
                    </motion.p>
                    <motion.div
                      className="text-gray-200 text-base bg-black/40 p-6 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="mb-3">🌙 Utilisez votre pouvoir la nuit pour aider le village.</p>
                      <p>☀️ Votez le jour pour démasquer les loups.</p>
                    </motion.div>
                  </div>
                )}

                <motion.div 
                  className="mt-8 text-sm text-yellow-500 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  🔄 Cliquez pour retourner
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texte d'ambiance en arrière-plan */}
      <motion.div
        className="absolute bottom-10 text-center w-full text-yellow-500/30 text-sm font-medieval"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        « Le destin en a décidé ainsi... »
      </motion.div>
    </motion.div>
  );
}
