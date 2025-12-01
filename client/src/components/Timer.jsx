// Timer.jsx - Composant de compte à rebours
import { motion } from 'framer-motion';

export function Timer({ timeLeft, total }) {
  const percentage = total ? (timeLeft / total) * 100 : 0;
  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Cercle de progression */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          {/* Cercle de fond */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          {/* Cercle de progression */}
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className={`${
              percentage > 30 ? 'text-blue-500' : 'text-red-500'
            } transition-colors duration-500`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Temps restant */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{seconds}</span>
        </div>
      </div>

      {/* Barre de progression linéaire */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${
            percentage > 30 ? 'bg-blue-500' : 'bg-red-500'
          } transition-colors duration-500`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
