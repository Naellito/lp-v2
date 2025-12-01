// GameRoom.jsx - Salle de jeu pour les joueurs
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PhaseAnimation } from '../components/PhaseAnimation';
import { RoleCard } from '../components/RoleCard';
import { VotePanel } from '../components/VotePanel';
import { GameStatus } from '../components/GameStatus';
import { PlayerCard } from '../components/PlayerCard';
import { DeathReveal } from '../components/DeathReveal';
import { Chat } from '../components/Chat';
import { AmbientParticles } from '../components/AmbientParticles';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function GameRoom() {
  const { roomCode: routeRoomCode } = useParams();
  const navigate = useNavigate();
  const {
    roomCode,
    player,
    myRole,
    myTeam,
    roleData,
    isAlive,
    inLove,
    lovePartner,
    players,
    phase,
    nightCount,
    dayCount,
    gameStarted,
    deaths,
    winner,
    werewolfVote,
    seerInspect,
    witchHeal,
    witchKill,
    cupidonChoose,
    dayVote,
    hunterKill,
    getNightVictim,
    nightVictim,
    witchPotions,
    seerResult,
    chatMessages,
    werewolfChatMessages,
    sendChatMessage,
  } = useGame();

  const [showPhaseAnimation, setShowPhaseAnimation] = useState(false);
  const [showDeathReveal, setShowDeathReveal] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [werewolfChatOpen, setWerewolfChatOpen] = useState(false);

  useEffect(() => {
    if (!roomCode) {
      navigate('/');
    }
  }, [roomCode, navigate]);

  useEffect(() => {
    setShowPhaseAnimation(true);
    setActionCompleted(false);
    setSelectedTargets([]);
    
    // Charger la victime pour la sorcière
    if (phase === 'night_witch' && myRole === 'sorciere') {
      getNightVictim();
    }
  }, [phase]);

  useEffect(() => {
    if (deaths && deaths.length > 0 && phase === 'day_intro') {
      setShowDeathReveal(true);
    }
  }, [deaths, phase]);

  const handleWerewolfVote = async (targetId) => {
    await werewolfVote(targetId);
    setActionCompleted(true);
  };

  const handleSeerInspect = async (targetId) => {
    await seerInspect(targetId);
    setActionCompleted(true);
  };

  const handleWitchAction = async (action, targetId = null) => {
    if (action === 'heal') {
      await witchHeal();
    } else if (action === 'kill' && targetId) {
      await witchKill(targetId);
    }
    setActionCompleted(true);
  };

  const handleCupidonChoose = async () => {
    if (selectedTargets.length === 2) {
      await cupidonChoose(selectedTargets[0], selectedTargets[1]);
      setActionCompleted(true);
    }
  };

  const handleDayVote = async (targetId) => {
    await dayVote(targetId);
    setActionCompleted(true);
  };

  const handleHunterKill = async (targetId) => {
    await hunterKill(targetId);
    setActionCompleted(true);
  };

  // Lobby - En attente
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-blue via-night-purple to-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🐺 Salle d'attente
            </h1>
            <div className="bg-gray-800 rounded-lg px-6 py-3 inline-block">
              <span className="text-gray-400">Code de la partie : </span>
              <span className="text-3xl font-bold text-yellow-400 tracking-wider">
                {roomCode}
              </span>
            </div>
          </div>

          <div className="bg-gray-900/80 rounded-2xl p-8 border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              👥 Joueurs connectés ({players.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {players.map((p) => (
                <PlayerCard key={p.id} player={p} disconnected={!p.connected} />
              ))}
            </div>

            <div className="text-center text-gray-400">
              <p>⏳ En attente du démarrage par le narrateur...</p>
              <p className="text-sm mt-2">Minimum 4 joueurs requis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du rôle au début - PLEIN ÉCRAN
  if (gameStarted && myRole && nightCount === 1 && phase === 'night_intro') {
    return (
      <AnimatePresence mode="wait">
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
          <RoleCard
            role={myRole}
            team={myTeam}
            roleData={roleData}
          />
        {inLove && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, type: "spring", bounce: 0.6 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 text-center bg-pink-900/80 backdrop-blur-xl border-4 border-pink-500 rounded-2xl p-8 shadow-[0_0_50px_rgba(236,72,153,0.8)] max-w-md"
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💘
            </motion.div>
            <h3 className="text-3xl font-bold text-pink-300 mb-3" style={{ textShadow: '0 0 20px rgba(236,72,153,0.8)' }}>
              Vous êtes amoureux !
            </h3>
            <p className="text-gray-200 text-lg">
              Si votre amoureux meurt, vous mourrez aussi...
            </p>
          </motion.div>
        )}
        </div>
      </AnimatePresence>
    );
  }

  const alivePlayers = players.filter(p => p.alive && p.id !== player?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-night-purple to-black p-4 relative">
      {/* Particules d'ambiance en arrière-plan */}
      <AmbientParticles phase={phase} />

      {/* Animations */}
      <AnimatePresence mode="wait">
        {showPhaseAnimation && (
          <PhaseAnimation
            phase={phase}
            onComplete={() => setShowPhaseAnimation(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showDeathReveal && (
          <DeathReveal
            deaths={deaths}
            onComplete={() => setShowDeathReveal(false)}
          />
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto py-8">
        {/* Statut du jeu */}
        <GameStatus
          phase={phase}
          nightCount={nightCount}
          dayCount={dayCount}
          playersAlive={players.filter(p => p.alive).length}
          totalPlayers={players.length}
        />

        <div className="mt-8">
          {/* Mort - Attente */}
          {!isAlive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-gray-900/80 rounded-2xl border-2 border-red-700"
            >
              <div className="text-8xl mb-4">💀</div>
              <h2 className="text-4xl font-bold text-red-500 mb-4">
                Vous êtes mort
              </h2>
              <p className="text-gray-400 mb-8">
                Observez la suite de la partie en spectateur
              </p>
              
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Joueurs restants :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.filter(p => p.alive).map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Vivant - Actions selon phase et rôle */}
          {isAlive && (
            <>
              {/* Phase des loups */}
              {phase === 'night_werewolves' && myRole === 'loup-garou' && (
                <VotePanel
                  players={alivePlayers}
                  onVote={handleWerewolfVote}
                  title="🐺 Choisissez votre victime"
                  myId={player?.id}
                />
              )}

              {/* Phase de la voyante */}
              {phase === 'night_seer' && myRole === 'voyante' && !actionCompleted && (
                <VotePanel
                  players={alivePlayers}
                  onVote={handleSeerInspect}
                  title="🔮 Choisissez qui inspecter"
                  myId={player?.id}
                />
              )}

              {seerResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto mt-8 bg-purple-900/50 border-2 border-purple-600 rounded-xl p-6 text-center"
                >
                  <h3 className="text-2xl font-bold text-purple-300 mb-4">
                    Révélation
                  </h3>
                  <p className="text-white text-lg">
                    <strong>{seerResult.targetName}</strong> est
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    seerResult.team === 'werewolves' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {seerResult.team === 'werewolves' ? '🐺 Loup-Garou' : '🏘️ Villageois'}
                  </p>
                </motion.div>
              )}

              {/* Phase de la sorcière */}
              {phase === 'night_witch' && myRole === 'sorciere' && !actionCompleted && (
                <div className="max-w-4xl mx-auto bg-gray-900/80 rounded-2xl p-8 border-2 border-green-700">
                  <h2 className="text-3xl font-bold text-center mb-6 text-green-400">
                    🧪 Sorcière : Vos potions
                  </h2>

                  {nightVictim && (
                    <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
                      <p className="text-white text-center">
                        Cette nuit, <strong>{nightVictim.username}</strong> a été attaqué par les loups.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-900/30 border border-green-600 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-green-300 mb-3">
                        💚 Potion de Vie
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Sauver la victime des loups
                      </p>
                      <Button
                        onClick={() => handleWitchAction('heal')}
                        disabled={!witchPotions.heal || !nightVictim}
                        variant="success"
                        className="w-full"
                      >
                        {witchPotions.heal ? 'Utiliser' : 'Déjà utilisée'}
                      </Button>
                    </div>

                    <div className="bg-red-900/30 border border-red-600 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-red-300 mb-3">
                        💀 Potion de Mort
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Empoisonner un joueur
                      </p>
                      <Button
                        onClick={() => {
                          // Afficher panel de sélection
                          document.getElementById('witch-kill-panel').classList.remove('hidden');
                        }}
                        disabled={!witchPotions.kill}
                        variant="danger"
                        className="w-full"
                      >
                        {witchPotions.kill ? 'Utiliser' : 'Déjà utilisée'}
                      </Button>
                    </div>
                  </div>

                  <div id="witch-kill-panel" className="hidden mt-6">
                    <VotePanel
                      players={alivePlayers}
                      onVote={(targetId) => handleWitchAction('kill', targetId)}
                      title="Qui voulez-vous empoisonner ?"
                      myId={player?.id}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <Button
                      onClick={() => setActionCompleted(true)}
                      variant="secondary"
                    >
                      Ne rien faire
                    </Button>
                  </div>
                </div>
              )}

              {/* Phase de Cupidon */}
              {phase === 'night_cupidon' && myRole === 'cupidon' && !actionCompleted && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-6 bg-pink-900/50 border-2 border-pink-600 rounded-xl p-6">
                    <h2 className="text-3xl font-bold text-pink-300 mb-2">
                      💘 Formez un couple
                    </h2>
                    <p className="text-gray-300">
                      Sélectionnez 2 joueurs. Si l'un meurt, l'autre mourra aussi.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Sélectionnés : {selectedTargets.length} / 2
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {players.filter(p => p.alive).map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        onClick={() => {
                          if (selectedTargets.includes(p.id)) {
                            setSelectedTargets(prev => prev.filter(id => id !== p.id));
                          } else if (selectedTargets.length < 2) {
                            setSelectedTargets(prev => [...prev, p.id]);
                          }
                        }}
                        selected={selectedTargets.includes(p.id)}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleCupidonChoose}
                      disabled={selectedTargets.length !== 2}
                      variant="primary"
                    >
                      Confirmer le couple
                    </Button>
                  </div>
                </div>
              )}

              {/* Vote du jour */}
              {phase === 'day_vote' && (
                <VotePanel
                  players={alivePlayers}
                  onVote={handleDayVote}
                  title="🗳️ Votez pour éliminer un joueur"
                  allowSkip={true}
                  myId={player?.id}
                />
              )}

              {/* Chasseur revenge */}
              {!isAlive && roleData?.id === 'chasseur' && !actionCompleted && (
                <VotePanel
                  players={players.filter(p => p.alive)}
                  onVote={handleHunterKill}
                  title="🎯 Chasseur : Choisissez votre dernière cible"
                />
              )}

              {/* Phases d'attente */}
              {['night_intro', 'day_intro', 'day_discussion', 'day_result'].includes(phase) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <p className="text-2xl text-gray-400">
                    {phase === 'day_discussion' 
                      ? 'Discutez avec les autres joueurs sur Discord'
                      : 'En attente de la prochaine phase...'}
                  </p>
                </div>
              )}

              {/* Phases où le joueur dort */}
              {phase.startsWith('night_') && 
               !['night_intro'].includes(phase) &&
               ((phase === 'night_werewolves' && myRole !== 'loup-garou') ||
                (phase === 'night_seer' && myRole !== 'voyante') ||
                (phase === 'night_witch' && myRole !== 'sorciere') ||
                (phase === 'night_cupidon' && myRole !== 'cupidon')) && (
                <div className="text-center py-12">
                  <div className="text-8xl mb-4">😴</div>
                  <p className="text-3xl text-gray-400 mb-2">
                    Vous dormez...
                  </p>
                  <p className="text-gray-500">
                    D'autres joueurs sont actifs cette nuit
                  </p>
                </div>
              )}

              {actionCompleted && !['day_vote', 'night_werewolves'].includes(phase) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-2xl text-green-400 mb-2">
                    Action effectuée
                  </p>
                  <p className="text-gray-400">
                    En attente de la suite...
                  </p>
                </div>
              )}
            </>
          )}

          {/* Victoire ÉPIQUE avec confettis et feux d'artifice */}
          <AnimatePresence mode="wait">
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className={`fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-gradient-to-br ${
                  winner === 'werewolves' 
                    ? 'from-red-900 via-red-700 to-black' 
                    : 'from-blue-900 via-blue-600 to-black'
                }`}
              >
              {/* Confettis et particules de victoire */}
              {Array.from({ length: 150 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-3 h-3 ${
                    winner === 'werewolves' 
                      ? i % 2 === 0 ? 'bg-red-500' : 'bg-orange-500'
                      : i % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                    rotate: `${Math.random() * 360}deg`,
                  }}
                  animate={{
                    y: ['0vh', '120vh'],
                    x: [0, (Math.random() - 0.5) * 200],
                    rotate: [0, Math.random() * 720],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeIn",
                  }}
                />
              ))}

              {/* Feux d'artifice */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`firework-${i}`}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 40}%`,
                  }}
                >
                  {[...Array(12)].map((_, j) => (
                    <motion.div
                      key={j}
                      className={`absolute w-2 h-2 rounded-full ${
                        winner === 'werewolves' ? 'bg-yellow-400' : 'bg-cyan-400'
                      }`}
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((j * 30 * Math.PI) / 180) * 100,
                        y: Math.sin((j * 30 * Math.PI) / 180) * 100,
                        scale: [0, 1.5, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </motion.div>
              ))}

              {/* Cercles de victoire pulsants */}
              <motion.div
                className={`absolute w-screen h-screen rounded-full border-8 ${
                  winner === 'werewolves' ? 'border-red-500/30' : 'border-blue-500/30'
                }`}
                animate={{
                  scale: [0.5, 2, 0.5],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <div className="text-center max-w-4xl px-8 relative z-10">
                {/* Emoji de victoire avec animation explosive */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [0, 1.5, 1.2, 1],
                    rotate: [180, 360, 0],
                  }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.6 }}
                  className="text-9xl mb-8 filter drop-shadow-2xl"
                >
                  {winner === 'werewolves' ? '🐺' : '🏘️'}
                </motion.div>

                {/* Titre avec effet néon */}
                <motion.h2
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    textShadow: [
                      '0 0 20px rgba(251,191,36,0.8)',
                      '0 0 60px rgba(251,191,36,1)',
                      '0 0 20px rgba(251,191,36,0.8)',
                    ]
                  }}
                  transition={{ 
                    y: { duration: 0.8, type: "spring" },
                    textShadow: { duration: 2, repeat: Infinity }
                  }}
                  className="text-7xl font-bold mb-6 text-yellow-400"
                >
                  {winner === 'werewolves' ? '🎉 Les Loups-Garous gagnent ! 🎉' : '🎊 Le Village gagne ! 🎊'}
                </motion.h2>

                {/* Sous-titre animé */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                  className="bg-black/60 backdrop-blur-xl border-4 border-yellow-500 rounded-3xl p-8 mb-8"
                >
                  <motion.p
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl text-white font-semibold"
                  >
                    {winner === 'werewolves' 
                      ? '🐺 Les loups ont dévoré tous les villageois !'
                      : '🏘️ Tous les loups-garous ont été éliminés !'}
                  </motion.p>
                </motion.div>

                {/* Stats de la partie */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-3 gap-6 mb-8"
                >
                  <div className="bg-black/40 rounded-2xl p-6 border-2 border-white/20">
                    <div className="text-4xl mb-2">🌙</div>
                    <div className="text-3xl font-bold text-white">{nightCount}</div>
                    <div className="text-sm text-gray-400">Nuits</div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-6 border-2 border-white/20">
                    <div className="text-4xl mb-2">☀️</div>
                    <div className="text-3xl font-bold text-white">{dayCount}</div>
                    <div className="text-sm text-gray-400">Jours</div>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-6 border-2 border-white/20">
                    <div className="text-4xl mb-2">💀</div>
                    <div className="text-3xl font-bold text-white">{players.filter(p => !p.alive).length}</div>
                    <div className="text-sm text-gray-400">Morts</div>
                  </div>
                </motion.div>

                {/* Bouton de retour */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring", bounce: 0.6 }}
                >
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="primary"
                    className="text-2xl px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-110 transition-all"
                  >
                    🏠 Retour à l'accueil
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>

          {/* Chat général */}
          <Chat
            messages={chatMessages}
            onSendMessage={(msg) => sendChatMessage(msg, 'general')}
            chatType="general"
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
            myRole={myRole}
            phase={phase}
          />

          {/* Chat des loups (seulement pour les loups-garous) */}
          {myRole === 'loup-garou' && (
            <Chat
              messages={werewolfChatMessages}
              onSendMessage={(msg) => sendChatMessage(msg, 'werewolf')}
              chatType="werewolf"
              isOpen={werewolfChatOpen}
              onToggle={() => setWerewolfChatOpen(!werewolfChatOpen)}
              myRole={myRole}
              phase={phase}
            />
          )}
        </div>
      </div>
    </div>
  );
}
