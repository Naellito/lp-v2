// NarratorDashboard.jsx - Dashboard complet du narrateur
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PlayerCard } from '../components/PlayerCard';
import { Button } from '../components/Button';
import { GameStatus } from '../components/GameStatus';
import { motion } from 'framer-motion';

export function NarratorDashboard() {
  const { roomCode: routeRoomCode } = useParams();
  const navigate = useNavigate();
  const {
    roomCode,
    isNarrator,
    players,
    phase,
    nightCount,
    dayCount,
    gameStarted,
    deaths,
    winner,
    startGame,
    nextPhase,
    getGameState,
    kickPlayer,
  } = useGame();

  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);

  useEffect(() => {
    if (!roomCode || !isNarrator) {
      navigate('/');
    }
  }, [roomCode, isNarrator, navigate]);

  useEffect(() => {
    if (gameStarted && isNarrator) {
      loadGameState();
    }
  }, [phase, gameStarted]);

  const loadGameState = async () => {
    try {
      const state = await getGameState();
      setGameState(state);
    } catch (error) {
      console.error('Erreur chargement état:', error);
    }
  };

  const handleStartGame = async () => {
    if (players.length < 4) {
      alert('Minimum 4 joueurs requis pour démarrer');
      return;
    }

    setLoading(true);
    try {
      await startGame();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPhase = async () => {
    setLoading(true);
    try {
      await nextPhase();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKickPlayer = async (playerId) => {
    if (!confirm('Voulez-vous vraiment expulser ce joueur ?')) {
      return;
    }

    try {
      await kickPlayer(playerId);
    } catch (error) {
      alert(error.message);
    }
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

  const getRoleName = (roleId) => {
    const names = {
      'loup-garou': 'Loup-Garou',
      'voyante': 'Voyante',
      'sorciere': 'Sorcière',
      'cupidon': 'Cupidon',
      'chasseur': 'Chasseur',
      'villageois': 'Villageois',
    };
    return names[roleId] || roleId;
  };

  const getPhaseInstructions = (currentPhase) => {
    switch (currentPhase) {
      case 'lobby':
        return 'Attendez que tous les joueurs rejoignent, puis lancez la partie.';
      case 'night_intro':
        return 'Annoncez que la nuit tombe. Le village s\'endort...';
      case 'night_cupidon':
        return 'Cupidon se réveille et choisit un couple d\'amoureux. Attendez sa décision.';
      case 'night_werewolves':
        return 'Les loups-garous se réveillent et désignent une victime. Surveillez leurs votes.';
      case 'night_seer':
        return 'La voyante se réveille et inspecte un joueur. Attendez sa décision.';
      case 'night_witch':
        return 'La sorcière se réveille. Elle peut sauver la victime des loups ou empoisonner quelqu\'un.';
      case 'day_intro':
        return 'Le jour se lève. Révélez les morts de la nuit.';
      case 'day_discussion':
        return 'Phase de discussion. Les joueurs débattent sur Discord. Passez au vote quand vous êtes prêt.';
      case 'day_vote':
        return 'Les joueurs votent pour éliminer quelqu\'un. Surveillez les votes.';
      case 'day_result':
        return 'Révélez le résultat du vote et la personne éliminée.';
      case 'game_over':
        return 'La partie est terminée ! Un camp a gagné.';
      default:
        return 'Phase en cours...';
    }
  };

  // Lobby - Avant le début
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Dashboard Narrateur
            </h1>
            <div className="bg-gray-800 rounded-lg px-6 py-3 inline-block">
              <span className="text-gray-400">Code de la partie : </span>
              <span className="text-3xl font-bold text-yellow-400 tracking-wider">
                {roomCode}
              </span>
            </div>
          </motion.div>

          {/* Liste des joueurs */}
          <div className="bg-gray-900/80 rounded-2xl p-8 border-2 border-purple-700 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              👥 Joueurs connectés ({players.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((p) => (
                <div key={p.id} className="relative">
                  <PlayerCard player={p} disconnected={!p.connected} />
                  <button
                    onClick={() => handleKickPlayer(p.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold transition-colors"
                    title="Expulser"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Informations */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-300 mb-3">
              📜 Instructions pour démarrer :
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ Minimum 4 joueurs requis</li>
              <li>✓ Assurez-vous que tout le monde est prêt sur Discord</li>
              <li>✓ Les rôles seront distribués automatiquement</li>
              <li>✓ Vous verrez tous les rôles et pourrez gérer chaque phase</li>
            </ul>
          </div>

          {/* Bouton démarrer */}
          <div className="text-center">
            <Button
              onClick={handleStartGame}
              disabled={loading || players.length < 4}
              variant="success"
              className="text-2xl px-12 py-6"
            >
              {loading ? '⏳ Démarrage...' : '🚀 Lancer la partie'}
            </Button>
            {players.length < 4 && (
              <p className="text-yellow-400 mt-4">
                ⚠️ Attendez au moins 4 joueurs
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Utiliser les joueurs du gameState (avec rôles) si disponible, sinon ceux du contexte
  const playersToDisplay = gameState?.players || players;

  // Partie en cours
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🎭 Dashboard Narrateur
              </h1>
              <p className="text-gray-400">Code: <span className="text-yellow-400 font-bold">{roomCode}</span></p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleNextPhase}
                disabled={loading}
                variant="primary"
                className="text-lg px-6 py-3"
              >
                {loading ? '⏳' : '⏭️'} Phase suivante
              </Button>
            </div>
          </div>

          <GameStatus
            phase={phase}
            nightCount={nightCount}
            dayCount={dayCount}
            playersAlive={playersToDisplay.filter(p => p.alive).length}
            totalPlayers={playersToDisplay.length}
          />
        </div>

        {/* Instructions de phase */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-yellow-900/30 border-2 border-yellow-600 rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-yellow-300 mb-2">
            📢 Instructions
          </h3>
          <p className="text-white text-lg">
            {getPhaseInstructions(phase)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Joueurs vivants */}
          <div className="lg:col-span-2 bg-gray-900/80 rounded-2xl p-6 border-2 border-green-700">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              ✅ Joueurs vivants ({playersToDisplay.filter(p => p.alive).length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playersToDisplay.filter(p => p.alive).map((p) => (
                <div key={p.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-lg">
                      {p.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{p.username}</h3>
                      <p className="text-sm text-gray-400">
                        {getRoleEmoji(p.role)} {getRoleName(p.role)}
                      </p>
                    </div>
                    {!p.connected && (
                      <span className="text-xs text-yellow-400">⚠️ Déco</span>
                    )}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded inline-block ${
                    p.team === 'werewolves' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {p.team === 'werewolves' ? '🐺 Loups' : '🏘️ Village'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Joueurs morts */}
          <div className="bg-gray-900/80 rounded-2xl p-6 border-2 border-red-700">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              💀 Morts ({playersToDisplay.filter(p => !p.alive).length})
            </h2>
            <div className="space-y-3">
              {playersToDisplay.filter(p => !p.alive).map((p) => (
                <div key={p.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700 opacity-60">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getRoleEmoji(p.role)}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm line-through">
                        {p.username}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {getRoleName(p.role)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {playersToDisplay.filter(p => !p.alive).length === 0 && (
                <p className="text-gray-500 text-sm text-center">Aucun mort</p>
              )}
            </div>
          </div>
        </div>

        {/* Informations de phase détaillées */}
        {gameState && (
          <div className="mt-6 bg-gray-900/80 rounded-2xl p-6 border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              📊 Détails de la phase
            </h2>

            {/* Votes des loups */}
            {phase === 'night_werewolves' && gameState.actions?.werewolvesVote && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-red-300 mb-2">
                  🐺 Votes des loups-garous :
                </h3>
                {Object.entries(gameState.actions.werewolvesVote).length > 0 ? (
                  <ul className="text-sm text-gray-300 space-y-1">
                    {Object.entries(gameState.actions.werewolvesVote).map(([wolfId, targetId]) => {
                      const wolf = playersToDisplay.find(p => p.id === wolfId);
                      const target = playersToDisplay.find(p => p.id === targetId);
                      return (
                        <li key={wolfId}>
                          • {wolf?.username} → {target?.username}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">En attente des votes...</p>
                )}
              </div>
            )}

            {/* Victime de la nuit */}
            {gameState.nightVictim && ['night_witch', 'day_intro'].includes(phase) && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-red-300 mb-2">
                  🎯 Victime désignée par les loups :
                </h3>
                <p className="text-white text-lg">
                  {playersToDisplay.find(p => p.id === gameState.nightVictim)?.username || 'Inconnu'}
                </p>
              </div>
            )}

            {/* Votes du jour */}
            {phase === 'day_vote' && gameState.actions?.dayVotes && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
                <h3 className="font-semibold text-blue-300 mb-2">
                  🗳️ Votes du village :
                </h3>
                {Object.entries(gameState.actions.dayVotes).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(gameState.actions.dayVotes).map(([voterId, targetId]) => {
                      const voter = playersToDisplay.find(p => p.id === voterId);
                      const target = targetId ? playersToDisplay.find(p => p.id === targetId) : null;
                      return (
                        <div key={voterId} className="text-sm text-gray-300">
                          • {voter?.username} → {target ? target.username : 'Vote blanc'}
                        </div>
                      );
                    })}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="font-semibold text-blue-300 mb-2">Décompte :</h4>
                      {(() => {
                        const counts = {};
                        Object.values(gameState.actions.dayVotes).forEach(targetId => {
                          if (targetId) {
                            counts[targetId] = (counts[targetId] || 0) + 1;
                          }
                        });
                        return Object.entries(counts)
                          .sort(([,a], [,b]) => b - a)
                          .map(([targetId, count]) => {
                            const target = playersToDisplay.find(p => p.id === targetId);
                            return (
                              <div key={targetId} className="text-white">
                                {target?.username} : {count} vote(s)
                              </div>
                            );
                          });
                      })()}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">En attente des votes...</p>
                )}
              </div>
            )}

            {/* Potions sorcière */}
            {gameState.witchPotions && (
              <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mt-4">
                <h3 className="font-semibold text-green-300 mb-2">
                  🧪 Potions de la sorcière :
                </h3>
                <div className="flex gap-4 text-sm">
                  <div>
                    Vie : {gameState.witchPotions.heal ? '✅ Disponible' : '❌ Utilisée'}
                  </div>
                  <div>
                    Mort : {gameState.witchPotions.kill ? '✅ Disponible' : '❌ Utilisée'}
                  </div>
                </div>
              </div>
            )}

            {/* Couple */}
            {gameState.couple && gameState.couple.length === 2 && (
              <div className="bg-pink-900/30 border border-pink-700 rounded-xl p-4 mt-4">
                <h3 className="font-semibold text-pink-300 mb-2">
                  💘 Couple d'amoureux :
                </h3>
                <p className="text-white">
                  {players.find(p => p.id === gameState.couple[0])?.username} ❤️{' '}
                  {players.find(p => p.id === gameState.couple[1])?.username}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Victoire */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-8 border-4 border-yellow-400 text-center"
          >
            <div className="text-8xl mb-4">
              {winner === 'werewolves' ? '🐺' : '🏘️'}
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              {winner === 'werewolves' ? 'Les Loups-Garous gagnent !' : 'Le Village gagne !'}
            </h2>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="mt-6"
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
