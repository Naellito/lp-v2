// usePhaseTimer.js - Hook pour gérer les timers de phase
import { useState, useEffect, useCallback } from 'react';

export function usePhaseTimer(phase, duration, onComplete) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (duration && duration > 0) {
      setTimeLeft(duration);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [phase, duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          setIsRunning(false);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(true);
  }, [duration]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    timeLeft,
    isRunning,
    reset,
    stop,
    percentage: duration ? ((duration - timeLeft) / duration) * 100 : 0,
  };
}
