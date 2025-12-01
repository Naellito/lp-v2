// DeathReveal.jsx - Animation de révélation des morts SPECTACULAIRE
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function DeathReveal({ deaths, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!deaths || deaths.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    if (currentIndex < deaths.length) {
      // Générer des particules pour chaque mort
      const currentDeath = deaths[currentIndex];
      generateParticles(currentDeath.cause);
      
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 4000); // Augmenté à 4s pour profiter de l'animation
      return () => clearTimeout(timer);
    } else {
      // Commencer le fade-out
      const fadeTimer = setTimeout(() => {
        setShow(false);
      }, 1500);
      
      // Appeler onComplete après que l'animation de sortie soit finie
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2300); // 1500ms + 800ms de transition
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [currentIndex, deaths, onComplete]);

  const generateParticles = (cause) => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      cause: cause
    }));
    setParticles(newParticles);
  };

  if (!deaths || deaths.length === 0) return null;
  if (currentIndex >= deaths.length) return null;

  const currentDeath = deaths[currentIndex];

  const getCauseEmoji = (cause) => {
    switch (cause) {
      case 'werewolves': return '🐺';
      case 'vote': return '🗳️';
      case 'witch': return '🧪';
      case 'hunter': return '🎯';
      case 'love': return '💔';
      default: return '💀';
    }
  };

  const getCauseText = (cause) => {
    switch (cause) {
      case 'werewolves': return 'a été dévoré par les loups-garous';
      case 'vote': return 'a été éliminé par le village';
      case 'witch': return 'a été empoisonné par la sorcière';
      case 'hunter': return 'a été tué par le chasseur';
      case 'love': return 'est mort de chagrin';
      default: return 'est décédé';
    }
  };

  const getCauseColor = (cause) => {
    switch (cause) {
      case 'werewolves': return 'from-red-900 via-red-600 to-black';
      case 'vote': return 'from-blue-900 via-blue-600 to-black';
      case 'witch': return 'from-green-900 via-green-600 to-black';
      case 'hunter': return 'from-orange-900 via-orange-600 to-black';
      case 'love': return 'from-pink-900 via-pink-600 to-black';
      default: return 'from-gray-900 via-gray-600 to-black';
    }
  };

  const getParticleColor = (cause) => {
    switch (cause) {
      case 'werewolves': return 'bg-red-500';
      case 'vote': return 'bg-blue-500';
      case 'witch': return 'bg-green-500';
      case 'hunter': return 'bg-orange-500';
      case 'love': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getParticleShape = (cause) => {
    // Différentes formes selon la cause
    if (cause === 'love') return '💔';
    if (cause === 'witch') return '✨';
    if (cause === 'hunter') return '➤';
    if (cause === 'vote') return '▪';
    return '●';
  };

  return (
    <AnimatePresence mode="wait">
      {show && currentDeath && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${getCauseColor(currentDeath.cause)} overflow-hidden`}
        >
          {/* Particules d'ambiance selon la cause de mort */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute ${getParticleColor(particle.cause)} opacity-70`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                borderRadius: particle.cause === 'vote' ? '0%' : '50%',
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.5, 1, 0],
                opacity: [0, 0.8, 0.6, 0],
                y: particle.cause === 'werewolves' ? [0, -100, -200] : [0, 100, 200],
                x: particle.cause === 'hunter' ? [0, 50] : [0, Math.random() * 40 - 20],
                rotate: [0, particle.rotation],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Cercles de choc */}
          <motion.div
            className="absolute w-96 h-96 rounded-full border-4 border-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full border-4 border-white/30"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          />

          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -50 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center max-w-2xl px-8 relative z-10"
          >
            {/* Emoji principal avec animation selon la cause */}
            <motion.div
              animate={
                currentDeath.cause === 'werewolves' 
                  ? { 
                      scale: [1, 1.4, 1.2, 1.4, 1],
                      rotate: [0, -15, 15, -15, 0],
                    }
                  : currentDeath.cause === 'witch'
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 360],
                      filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)']
                    }
                  : currentDeath.cause === 'hunter'
                  ? {
                      scale: [1, 0.8, 1.5, 1],
                      x: [0, -20, 20, 0],
                    }
                  : currentDeath.cause === 'love'
                  ? {
                      scale: [1, 1.2, 0.8, 1.2, 0.9],
                      y: [0, -10, 0, -10, 0],
                    }
                  : {
                      scale: [1, 1.3, 1],
                      rotate: [0, -10, 10, -10, 0]
                    }
              }
              transition={{ duration: 2, repeat: 1 }}
              className="text-9xl mb-8 filter drop-shadow-2xl"
            >
              {getCauseEmoji(currentDeath.cause)}
            </motion.div>

            {/* Nom avec effet néon pulsant */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                textShadow: [
                  '0 0 20px rgba(239,68,68,0.8)',
                  '0 0 40px rgba(239,68,68,1)',
                  '0 0 20px rgba(239,68,68,0.8)',
                ]
              }}
              transition={{ 
                delay: 0.2,
                textShadow: { duration: 2, repeat: Infinity }
              }}
              className="text-6xl font-bold text-red-500 mb-6"
            >
              {currentDeath.username}
            </motion.h2>

            {/* Message de mort avec animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
              className="bg-black/60 backdrop-blur-xl border-4 border-white/20 rounded-2xl p-8 mb-6"
            >
              <motion.p
                className="text-3xl text-white font-semibold"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getCauseText(currentDeath.cause)}
              </motion.p>
            </motion.div>

            {/* Compteur des morts restantes */}
            {currentIndex < deaths.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="text-gray-300 text-lg bg-black/40 inline-block px-6 py-3 rounded-full"
              >
                ⏳ {deaths.length - currentIndex - 1} autre(s) mort(s)...
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
