// useSound.js - Hook pour gérer les sons (optionnel)
import { useCallback } from 'react';

export function useSound() {
  const playWolfHowl = useCallback(() => {
    // Optionnel : ajouter un son de loup
    console.log('🐺 Hurlement de loup');
  }, []);

  const playBell = useCallback(() => {
    // Optionnel : ajouter un son de cloche
    console.log('🔔 Son de cloche');
  }, []);

  const playDeath = useCallback(() => {
    // Optionnel : ajouter un son de mort
    console.log('💀 Son de mort');
  }, []);

  const playVictory = useCallback(() => {
    // Optionnel : ajouter un son de victoire
    console.log('🎉 Son de victoire');
  }, []);

  return {
    playWolfHowl,
    playBell,
    playDeath,
    playVictory,
  };
}
