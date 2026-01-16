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
        width: '800px',
        height: '600px',
        margin: '0 auto'
      }}
    />
  );
}

export default PhaserGame;
