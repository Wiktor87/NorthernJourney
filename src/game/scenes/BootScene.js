/**
 * BootScene - Asset Loading Scene
 * 
 * This scene loads all game assets and data files before starting the game.
 * It shows a loading screen and transitions to the main menu when complete.
 */

import Phaser from 'phaser';

// Import data files
import configData from '../../data/config.json';
import resourcesData from '../../data/resources.json';
import buildingsData from '../../data/buildings.json';
import creaturesData from '../../data/creatures.json';
import randomEventsData from '../../data/events/random-events.json';
import seasonalEventsData from '../../data/events/seasonal-events.json';
import storyEventsData from '../../data/events/story-events.json';
import seasonsData from '../../data/seasons.json';
import progressionData from '../../data/progression.json';

// Import dialogue files
import trollDialogue from '../../data/dialogues/creatures/troll_encounter.json';
import gnomeDialogue from '../../data/dialogues/creatures/gnome_encounter.json';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    this.createLoadingScreen();
    
    // Store data files in registry for access by other scenes
    this.registry.set('configData', configData);
    this.registry.set('resourcesData', resourcesData);
    this.registry.set('buildingsData', buildingsData);
    this.registry.set('creaturesData', creaturesData);
    this.registry.set('randomEventsData', randomEventsData);
    this.registry.set('seasonalEventsData', seasonalEventsData);
    this.registry.set('storyEventsData', storyEventsData);
    this.registry.set('seasonsData', seasonsData);
    this.registry.set('progressionData', progressionData);
    
    // Store dialogue files
    this.registry.set('dialogue_troll', trollDialogue);
    this.registry.set('dialogue_gnome', gnomeDialogue);
    
    // Add error handling for asset loading
    this.load.on('loaderror', (file) => {
      console.error('Failed to load asset:', file.key, file.url);
    });
    
    // Load custom sprite assets with keys matching what the game actually uses
    // Ground tiles - using your beautiful snowy diamond terrain tiles
    this.load.image('tile_grass', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_snow', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_snow_ground_01', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_snow_ground_02', 'assets/T_Ground_Snow_02.png');
    this.load.image('tile_forest', 'assets/T_Ground_Snow_02.png');
    this.load.image('tile_mountain', 'assets/T_Ground_Snow_02.png');
    this.load.image('tile_path', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_water', 'assets/T_Ground_Snow_02.png');
    
    // Trees - all 5 variants of your beautiful snow-covered pine trees
    this.load.image('tree_pine_snow_01', 'assets/T_Tree_Pine_Snow_01.png');
    this.load.image('tree_pine_snow_02', 'assets/T_Tree_Pine_Snow_02.png');
    this.load.image('tree_pine_snow_03', 'assets/T_Tree_Pine_Snow_03.png');
    this.load.image('tree_pine_snow_04', 'assets/T_Tree_Pine_Snow_04.png');
    this.load.image('tree_pine_snow_05', 'assets/T_Tree_Pine_Snow_05.png');
    
    // Buildings - your detailed snowy structures
    this.load.image('buildings/villager_hut', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/residential_house_snow_01', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/residential_house_snow_02', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/longhouse', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/well', 'assets/T_Well_Snow_02.png');
    this.load.image('buildings/well_snow', 'assets/T_Well_Snow_02.png');
    
    // Update loading bar
    this.load.on('progress', (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x88ccff, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });
  }

  create() {
    // Transition to main menu after a short delay
    this.time.delayedCall(500, () => {
      this.scene.start('MainMenuScene');
    });
  }

  createLoadingScreen() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Title
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Northern Journey', {
      font: '32px Arial',
      fill: '#ffffff'
    });
    this.loadingText.setOrigin(0.5, 0.5);
    
    // Loading text
    this.percentText = this.add.text(width / 2, height / 2 + 50, '0%', {
      font: '18px Arial',
      fill: '#ffffff'
    });
    this.percentText.setOrigin(0.5, 0.5);
    
    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(240, 270, 320, 50);
    
    // Progress bar
    this.progressBar = this.add.graphics();
    
    this.load.on('progress', (value) => {
      this.percentText.setText(parseInt(value * 100) + '%');
    });
  }
}
