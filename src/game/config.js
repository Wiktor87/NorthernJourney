/**
 * Phaser Game Configuration
 * 
 * Main configuration for the Phaser game instance.
 * This sets up the canvas, physics, and initial scene.
 */

import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import VillageScene from './scenes/VillageScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
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
  antialias: false
};
