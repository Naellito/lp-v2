// Home.jsx - Page d'accueil
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-night-purple to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Logo/Titre */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl mb-8"
        >
          🐺
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-4"
        >
          Loup-Garou
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 mb-4"
        >
          Fait par <span className="text-yellow-400 font-bold">Nael</span> pour vous divertir au max
        </motion.p>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-400 mb-12 italic"
        >
          Car je suis le <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              color: ['#facc15', '#fb923c', '#f59e0b', '#facc15']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="font-black text-2xl"
          >
            GOAT
          </motion.span> 🐐✨
        </motion.p>

        {/* Boutons principaux */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/create')}
            variant="primary"
            className="text-xl px-8 py-4"
          >
            ✨ Créer une partie
          </Button>
          
          <Button
            onClick={() => navigate('/join')}
            variant="outline"
            className="text-xl px-8 py-4"
          >
            🚪 Rejoindre une partie
          </Button>
        </motion.div>

        {/* Informations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">4-15 joueurs</h3>
            <p className="text-sm text-gray-400">
              Idéal pour les groupes d'amis
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-lg font-semibold text-white mb-2">6 rôles</h3>
            <p className="text-sm text-gray-400">
              Villageois, Loup, Voyante, Sorcière, Cupidon, Chasseur
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-lg font-semibold text-white mb-2">Temps réel</h3>
            <p className="text-sm text-gray-400">
              Synchronisé avec votre vocal Discord
            </p>
          </div>
        </motion.div>

        {/* Easter egg avec animations stylées */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 relative"
        >
          {/* Nom de la commu avec animations de ouf */}
          <motion.div
            className="text-3xl font-black mb-6 relative inline-block"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(236,72,153,0.8)',
                '0 0 40px rgba(236,72,153,1)',
                '0 0 20px rgba(236,72,153,0.8)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              animate={{ 
                color: ['#ec4899', '#f97316', '#8b5cf6', '#ec4899']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Marwa x Nina
            </motion.span>
            
            {/* Particules autour du texte */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 4) * 100],
                  y: [0, Math.sin(i * Math.PI / 4) * 100],
                  opacity: [1, 0],
                  scale: [0, 1.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
          
          {/* Message Easter egg avec pique subtile */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-gray-500 italic mt-4"
          >
            <span className="line-through opacity-50">Big up à la dictatrice</span>{' '}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              👑
            </motion.span>
            {' '}qui se croit le centre du monde
          </motion.p>
          
          <p className="text-xs text-gray-600 mt-2">
            tsais, le mec il cherche un moyen de mettre des piques en mode easter eggs 😏
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
