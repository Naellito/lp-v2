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
          className="text-xl text-gray-300 mb-12"
        >
          Le jeu de société en ligne pour vos soirées Discord
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

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-gray-500 text-sm"
        >
          <p>💡 Parfait pour jouer pendant un appel Discord</p>
          <p className="mt-2">Le site affiche les phases, rôles et votes - vous parlez sur Discord !</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
