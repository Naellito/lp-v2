// VotePanel.jsx - Panneau de vote
import { useState } from 'react';
import { PlayerCard } from './PlayerCard';
import { Button } from './Button';
import { motion } from 'framer-motion';

export function VotePanel({ players, onVote, title = 'Votez', allowSkip = false, myId }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (!selectedId && !allowSkip) return;
    
    try {
      await onVote(selectedId);
      setHasVoted(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const alivePlayers = players.filter(p => p.alive && p.id !== myId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-gray-900/80 rounded-2xl border-2 border-gray-700"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        {title}
      </h2>

      {hasVoted ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-2xl font-semibold text-green-400">
            Vote enregistré !
          </p>
          <p className="text-gray-400 mt-2">
            En attente des autres joueurs...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {alivePlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => setSelectedId(player.id)}
                selected={selectedId === player.id}
              />
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleVote}
              disabled={!selectedId && !allowSkip}
              variant="primary"
            >
              {selectedId ? 'Confirmer le vote' : 'Voter blanc'}
            </Button>
            
            {selectedId && (
              <Button
                onClick={() => setSelectedId(null)}
                variant="secondary"
              >
                Annuler
              </Button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
