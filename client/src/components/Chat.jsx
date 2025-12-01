// Chat.jsx - Composant de chat en jeu
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';

export function Chat({ messages, onSendMessage, chatType, isOpen, onToggle, myRole, phase }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim(), chatType);
      setInputMessage('');
    }
  };

  const getChatTitle = () => {
    if (chatType === 'werewolf') return '🐺 Chat des Loups-Garous';
    if (phase?.includes('night')) return '💤 Chat désactivé (Nuit)';
    return '💬 Chat du Village';
  };

  const getChatColor = () => {
    if (chatType === 'werewolf') return 'from-red-900 to-red-950';
    return 'from-blue-900 to-blue-950';
  };

  const getBorderColor = () => {
    if (chatType === 'werewolf') return 'border-red-600';
    return 'border-blue-600';
  };

  const canSendMessage = () => {
    // Les loups peuvent parler la nuit dans leur chat
    if (chatType === 'werewolf') return true;
    // Le chat général est désactivé la nuit
    if (phase?.includes('night')) return false;
    return true;
  };

  // Position du bouton selon le type de chat - Responsive
  const getButtonPosition = () => {
    // Sur mobile, on empile les boutons verticalement
    if (chatType === 'werewolf') {
      return 'bottom-24 sm:bottom-6 right-4 sm:right-28'; // Plus haut sur mobile, plus à gauche sur desktop
    }
    return 'bottom-6 right-4 sm:right-6';
  };

  // Position du panneau selon le type de chat - Responsive
  const getPanelPosition = () => {
    // Sur mobile en plein écran, pas besoin de décalage
    if (chatType === 'werewolf') return 'sm:right-28';
    return 'sm:right-6';
  };

  return (
    <div className="relative">
      {/* Bouton flottant pour ouvrir/fermer le chat - Responsive */}
      <motion.button
        onClick={onToggle}
        className={`fixed ${getButtonPosition()} z-40 p-3 sm:p-4 rounded-full ${
          chatType === 'werewolf' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white shadow-2xl border-2 ${getBorderColor()}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={messages.length > 0 && !isOpen ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <span className="text-xl sm:text-2xl">{chatType === 'werewolf' ? '🐺' : '💬'}</span>
          {messages.length > 0 && !isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {messages.length > 99 ? '99+' : messages.length}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Panneau de chat - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed ${getPanelPosition()} bottom-0 sm:bottom-24 left-0 sm:left-auto right-0 sm:right-auto z-40 
                       w-full sm:w-96 h-screen sm:h-[500px] 
                       sm:rounded-2xl border-t-4 sm:border-4 ${getBorderColor()} 
                       bg-gradient-to-br ${getChatColor()} backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className={`p-3 sm:p-4 border-b-2 ${getBorderColor()} flex justify-between items-center`}>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {getChatTitle()}
              </h3>
              <button
                onClick={onToggle}
                className="text-white hover:text-red-400 text-3xl sm:text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>

            {/* Messages - Responsive */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <p className="text-3xl sm:text-4xl mb-2">💬</p>
                  <p className="text-sm sm:text-base">Aucun message pour le moment...</p>
                  {chatType === 'werewolf' && (
                    <p className="text-xs sm:text-sm mt-2">Coordonnez-vous avec vos compagnons loups !</p>
                  )}
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${
                      msg.isSystem
                        ? 'text-center text-yellow-400 text-xs sm:text-sm italic'
                        : 'bg-black/30 rounded-lg p-2 sm:p-3'
                    }`}
                  >
                    {msg.isSystem ? (
                      <p className="text-xs sm:text-sm">{msg.text}</p>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="text-base sm:text-lg">{msg.playerEmoji || '👤'}</span>
                          <span className="font-semibold text-white text-sm sm:text-base truncate">{msg.username}</span>
                          <span className="text-xs text-gray-400 ml-auto">{msg.time}</span>
                        </div>
                        <p className="text-gray-200 text-xs sm:text-sm ml-5 sm:ml-7 break-words">{msg.text}</p>
                      </>
                    )}
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Responsive */}
            <form onSubmit={handleSubmit} className={`p-3 sm:p-4 border-t-2 ${getBorderColor()}`}>
              {canSendMessage() ? (
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={chatType === 'werewolf' ? 'Message aux loups...' : 'Message au village...'}
                    className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-black/50 border-2 border-gray-600 
                             text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                    maxLength={200}
                  />
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-4 sm:px-6 text-xl sm:text-base"
                  >
                    📤
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-400 text-xs sm:text-sm">
                  <p>💤 Le chat est désactivé pendant la nuit</p>
                  <p className="text-xs mt-1">Chut... Le village dort...</p>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style pour la scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
