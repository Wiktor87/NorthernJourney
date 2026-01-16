/**
 * PhaserGame Component
 * 
 * React wrapper for the Phaser game instance.
 * Creates and manages the Phaser game lifecycle.
 */

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './config.js';

function PhaserGame() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current && containerRef.current) {
      // Create Phaser game instance
      gameRef.current = new Phaser.Game({
        ...config,
        parent: containerRef.current
      });
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      id="phaser-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  );
}

export default PhaserGame;
