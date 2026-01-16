/**
 * Phaser Game Configuration
 * 
 * Main configuration for the Phaser game instance.
 * This sets up the canvas, physics, and initial scene.
 */

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MainMenuScene, VillageScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  antialias: false,
  audio: {
    noAudio: true
  }
};
