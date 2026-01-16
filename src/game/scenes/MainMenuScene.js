/**
 * MainMenuScene - Start Screen
 * 
 * Shows the main menu with options to start a new game,
 * continue a saved game, or adjust settings.
 */

import Phaser from 'phaser';
import { eventBridge } from '../EventBridge.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0);
    
    // Title
    const title = this.add.text(width / 2, height / 4, 'Northern Journey', {
      font: 'bold 48px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    title.setOrigin(0.5);
    
    // Subtitle
    const subtitle = this.add.text(width / 2, height / 4 + 50, 'A Norse Fishing Village Saga', {
      font: '20px Arial',
      fill: '#cccccc'
    });
    subtitle.setOrigin(0.5);
    
    // New Game button
    this.createButton(width / 2, height / 2, 'New Game', () => {
      this.startNewGame();
    });
    
    // Continue button (check if save exists)
    const hasSave = localStorage.getItem('northernjourney_save') !== null;
    this.createButton(width / 2, height / 2 + 70, 'Continue', () => {
      this.continueGame();
    }, hasSave);
    
    // Instructions
    const instructions = this.add.text(width / 2, height - 80, 
      'Guide your Norse village through harsh winters and mystical encounters.\n' +
      'Build, survive, and thrive in the unforgiving north.', {
      font: '14px Arial',
      fill: '#aaaaaa',
      align: 'center'
    });
    instructions.setOrigin(0.5);
  }

  createButton(x, y, text, callback, enabled = true) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 200, 50, enabled ? 0x4a7c3b : 0x666666);
    const label = this.add.text(0, 0, text, {
      font: '20px Arial',
      fill: enabled ? '#ffffff' : '#999999'
    });
    label.setOrigin(0.5);
    
    button.add([bg, label]);
    
    if (enabled) {
      button.setInteractive(new Phaser.Geom.Rectangle(-100, -25, 200, 50), Phaser.Geom.Rectangle.Contains);
      
      button.on('pointerover', () => {
        bg.setFillStyle(0x5c9c4b);
        this.input.setDefaultCursor('pointer');
      });
      
      button.on('pointerout', () => {
        bg.setFillStyle(0x4a7c3b);
        this.input.setDefaultCursor('default');
      });
      
      button.on('pointerdown', () => {
        bg.setFillStyle(0x3a6c2b);
      });
      
      button.on('pointerup', () => {
        bg.setFillStyle(0x5c9c4b);
        callback();
      });
    }
    
    return button;
  }

  startNewGame() {
    // Clear any existing save
    localStorage.removeItem('northernjourney_save');
    
    // Emit event to React components
    eventBridge.emit('game:new');
    
    // Start village scene
    this.scene.start('VillageScene');
  }

  continueGame() {
    const saveData = localStorage.getItem('northernjourney_save');
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData);
        this.registry.set('loadedSave', parsed);
        
        eventBridge.emit('game:load', parsed);
        
        this.scene.start('VillageScene');
      } catch (e) {
        console.error('Failed to load save:', e);
        this.startNewGame();
      }
    }
  }
}
