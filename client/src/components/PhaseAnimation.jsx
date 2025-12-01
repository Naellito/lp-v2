// PhaseAnimation.jsx - Animations CINÉMATIQUES pour les transitions de phase
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function PhaseAnimation({ phase, onComplete }) {
  const [show, setShow] = useState(true);
  const [stars, setStars] = useState([]);
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    setShow(true);
    
    // Générer des étoiles pour la nuit
    if (phase?.includes('night')) {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      }));
      setStars(newStars);
    }
    
    // Générer des nuages pour le jour
    if (phase?.includes('day')) {
      const newClouds = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        y: Math.random() * 30 + 10,
        delay: i * 0.3,
        duration: Math.random() * 3 + 5,
      }));
      setClouds(newClouds);
    }
    
    // Commencer le fade-out
    const fadeTimer = setTimeout(() => {
      setShow(false);
    }, 4000);
    
    // Appeler onComplete après que l'animation de sortie soit finie
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000); // 4000ms + 1000ms de transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [phase, onComplete]);

  const getPhaseData = (currentPhase) => {
    switch (currentPhase) {
      case 'night_intro':
        return {
          title: 'La Nuit Tombe',
          subtitle: 'Le village s\'endort...',
          emoji: '🌙',
          background: 'from-indigo-950 via-purple-950 to-black',
        };
      case 'night_cupidon':
        return {
          title: 'Cupidon se réveille',
          subtitle: 'Il est temps de former un couple',
          emoji: '💘',
          background: 'from-pink-950 via-purple-950 to-black',
        };
      case 'night_werewolves':
        return {
          title: 'Les Loups-Garous se réveillent',
          subtitle: 'Ils choisissent leur victime...',
          emoji: '🐺',
          background: 'from-red-950 via-black to-gray-950',
        };
      case 'night_seer':
        return {
          title: 'La Voyante se réveille',
          subtitle: 'Elle découvre un secret...',
          emoji: '🔮',
          background: 'from-blue-950 via-purple-900 to-black',
        };
      case 'night_witch':
        return {
          title: 'La Sorcière se réveille',
          subtitle: 'Elle peut sauver ou tuer...',
          emoji: '🧪',
          background: 'from-green-950 via-emerald-900 to-black',
        };
      case 'day_intro':
        return {
          title: 'Le Jour se Lève',
          subtitle: 'Le village se réveille...',
          emoji: '☀️',
          background: 'from-orange-600 via-yellow-500 to-sky-500',
        };
      case 'day_discussion':
        return {
          title: 'Discussion',
          subtitle: 'Qui sont les loups-garous ?',
          emoji: '🗣️',
          background: 'from-blue-600 via-sky-500 to-blue-400',
        };
      case 'day_vote':
        return {
          title: 'Vote du Village',
          subtitle: 'Choisissez qui éliminer',
          emoji: '🗳️',
          background: 'from-orange-700 via-red-600 to-red-700',
        };
      case 'game_over':
        return {
          title: 'Partie Terminée',
          subtitle: 'Un camp a gagné !',
          emoji: '🏆',
          background: 'from-yellow-600 via-amber-500 to-orange-600',
        };
      default:
        return {
          title: 'Loup-Garou',
          subtitle: 'Préparez-vous...',
          emoji: '🐺',
          background: 'from-gray-900 to-black',
        };
    }
  };

  const phaseData = getPhaseData(phase);
  const isNight = phase?.includes('night');
  const isDay = phase?.includes('day');

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${phaseData.background} overflow-hidden`}
        >
          {/* Étoiles scintillantes pour la nuit */}
          {isNight && stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0.3, 1, 0],
                scale: [0, 1, 0.8, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Lune pour la nuit */}
          {isNight && (
            <motion.div
              className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-[0_0_60px_rgba(255,255,255,0.6)]"
              initial={{ scale: 0, opacity: 0, x: 100, y: -100 }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              exit={{ scale: 0, opacity: 0, x: 100, y: -100 }}
              transition={{ duration: 2, type: "spring" }}
            >
              {/* Cratères de lune */}
              <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-gray-500 opacity-30" />
              <div className="absolute bottom-8 right-6 w-6 h-6 rounded-full bg-gray-500 opacity-20" />
              <div className="absolute top-14 right-10 w-3 h-3 rounded-full bg-gray-500 opacity-40" />
            </motion.div>
          )}

          {/* Soleil pour le jour */}
          {isDay && (
            <motion.div
              className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500"
              initial={{ scale: 0, opacity: 0, y: 200 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                rotate: 360,
                boxShadow: [
                  '0 0 40px rgba(251, 191, 36, 0.8)',
                  '0 0 80px rgba(251, 191, 36, 1)',
                  '0 0 40px rgba(251, 191, 36, 0.8)',
                ]
              }}
              transition={{ 
                y: { duration: 2, type: "spring" },
                scale: { duration: 2, type: "spring" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              {/* Rayons du soleil */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-20 bg-yellow-300 origin-top"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-70px)`,
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Nuages pour le jour */}
          {isDay && clouds.map((cloud, index) => (
            <motion.div
              key={cloud.id}
              className="absolute flex items-center gap-2"
              style={{ top: `${cloud.y}%` }}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '120%', opacity: [0, 1, 1, 0] }}
              transition={{
                duration: cloud.duration,
                delay: cloud.delay,
                ease: "linear",
              }}
            >
              <div className="w-16 h-12 bg-white/80 rounded-full" />
              <div className="w-20 h-16 bg-white/80 rounded-full -ml-6" />
              <div className="w-16 h-12 bg-white/80 rounded-full -ml-6" />
            </motion.div>
          ))}

          {/* Gradient d'horizon pour le jour */}
          {phase === 'day_intro' && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-green-800 via-green-600 to-transparent opacity-40"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              transition={{ duration: 3 }}
            />
          )}

          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0, y: -100 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="text-center relative z-10"
          >
            {/* Emoji principal avec animation selon phase */}
            <motion.div
              animate={
                isNight
                  ? { 
                      scale: [1, 1.3, 1],
                      rotate: [0, -15, 15, 0],
                      filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                    }
                  : {
                      scale: [1, 1.4, 1],
                      rotate: [0, 10, -10, 0],
                      y: [0, -20, 0]
                    }
              }
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-9xl mb-8 filter drop-shadow-2xl"
            >
              {phaseData.emoji}
            </motion.div>
            
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.5)',
                  '0 0 40px rgba(255,255,255,0.8)',
                  '0 0 20px rgba(255,255,255,0.5)',
                ]
              }}
              transition={{ 
                delay: 0.3,
                textShadow: { duration: 2, repeat: Infinity }
              }}
              className="text-6xl font-bold text-white mb-4 drop-shadow-lg"
            >
              {phaseData.title}
            </motion.h1>
            
            {/* Sous-titre avec animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
              className="bg-black/50 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 mt-6 max-w-2xl mx-auto"
            >
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl text-gray-100 font-semibold"
              >
                {phaseData.subtitle}
              </motion.p>
            </motion.div>

            {/* Barre de progression */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 4 }}
              className="relative h-3 bg-white/20 rounded-full mt-12 max-w-md mx-auto overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/90 rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
