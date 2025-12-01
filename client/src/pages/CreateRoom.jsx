// CreateRoom.jsx - Page de création de partie
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export function CreateRoom() {
  const navigate = useNavigate();
  const { createRoom, connected } = useGame();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!connected) {
      setError('Connexion au serveur...');
    } else {
      setError('');
    }
  }, [connected]);

  const handleCreate = async () => {
    if (!connected) {
      setError('Connexion au serveur en cours...');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createRoom();
      // Rediriger vers le dashboard du narrateur
      navigate(`/narrator/${result.roomCode}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la partie');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-night-purple to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900/80 backdrop-blur rounded-2xl p-8 border-2 border-gray-700 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Créer une partie
          </h1>
          <p className="text-gray-400">
            Vous serez le narrateur de cette partie
          </p>
        </div>

        {/* Informations narrateur */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-300 mb-2">📜 Rôle du narrateur :</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Gérer les phases du jeu</li>
            <li>• Voir tous les rôles</li>
            <li>• Contrôler le déroulement</li>
            <li>• Révéler les morts</li>
          </ul>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4"
          >
            <p className="text-red-300 text-sm">⚠️ {error}</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleCreate}
            disabled={loading || !connected}
            variant="primary"
            className="w-full text-lg"
          >
            {loading ? '⏳ Création...' : '✨ Créer la partie'}
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            className="w-full"
          >
            ← Retour
          </Button>
        </div>

        {!connected && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm">Connexion au serveur...</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
