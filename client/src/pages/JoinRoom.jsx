// JoinRoom.jsx - Page pour rejoindre une partie
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export function JoinRoom() {
  const navigate = useNavigate();
  const { joinRoom, connected } = useGame();
  
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    
    if (!roomCode.trim()) {
      setError('Veuillez entrer un code de partie');
      return;
    }

    if (!username.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    if (username.length > 15) {
      setError('Le pseudo doit faire maximum 15 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinRoom(roomCode.toUpperCase(), username.trim());
      // Rediriger vers la salle de jeu
      navigate(`/game/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
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
          <div className="text-6xl mb-4">🚪</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Rejoindre une partie
          </h1>
          <p className="text-gray-400">
            Entrez le code donné par le narrateur
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          {/* Code de la partie */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Code de la partie
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ex: AB4XZ"
              maxLength={5}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white text-center text-2xl font-bold tracking-widest uppercase focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>

          {/* Pseudo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Votre pseudo
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
              maxLength={15}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 15 caractères
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-900/30 border border-red-700 rounded-lg p-3"
            >
              <p className="text-red-300 text-sm">⚠️ {error}</p>
            </motion.div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || !connected || !roomCode || !username}
              variant="primary"
              className="w-full text-lg"
            >
              {loading ? '⏳ Connexion...' : '✅ Rejoindre'}
            </Button>

            <Button
              type="button"
              onClick={() => navigate('/')}
              variant="secondary"
              className="w-full"
            >
              ← Retour
            </Button>
          </div>
        </form>

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
