// AmbientParticles.jsx - Particules d'ambiance pour le fond
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AmbientParticles({ phase = 'night' }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    generateParticles();
  }, [phase]);

  const generateParticles = () => {
    const count = phase?.includes('night') ? 50 : 30;
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  };

  const getParticleStyle = () => {
    if (phase?.includes('night')) {
      // Lucioles pour la nuit
      return {
        emoji: '✨',
        color: 'bg-yellow-300',
        glow: 'shadow-[0_0_10px_rgba(253,224,71,0.8)]',
      };
    } else if (phase?.includes('day')) {
      // Pollen/poussière pour le jour
      return {
        emoji: '·',
        color: 'bg-white',
        glow: 'shadow-[0_0_5px_rgba(255,255,255,0.5)]',
      };
    }
    return {
      emoji: '·',
      color: 'bg-gray-400',
      glow: '',
    };
  };

  const style = getParticleStyle();

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${style.color} ${style.glow} rounded-full opacity-60`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -50, 50, 0],
            x: [0, Math.sin(particle.id) * 30, 0],
            opacity: [0, 0.3, 0.8, 0.3],
            scale: [0, 1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Brume pour la nuit */}
      {phase?.includes('night') && (
        <>
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-purple-900/20 to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-900/10 to-transparent"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              x: [-50, 50, -50],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
            }}
          />
        </>
      )}
    </motion.div>
  );
}
