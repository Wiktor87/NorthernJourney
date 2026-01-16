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
  
  // Load YOUR custom sprites with the correct keys
  this.load.image('tile_grass', 'assets/T_Ground_Snow_01.png');
  this.load.image('tile_forest', 'assets/T_Ground_Snow_02.png');
  this.load.image('tile_mountain', 'assets/T_Ground_Snow_02.png');
  this.load.image('tile_path', 'assets/T_Ground_Snow_01.png');
  this.load.image('tile_water', 'assets/T_Ground_Snow_01.png');
  
  // Load tree sprites
  this.load.image('tree_pine_snow_01', 'assets/T_Tree_Pine_Snow_01.png');
  this.load.image('tree_pine_snow_02', 'assets/T_Tree_Pine_Snow_02.png');
  this.load.image('tree_pine_snow_03', 'assets/T_Tree_Pine_Snow_03.png');
  this.load.image('tree_pine_snow_04', 'assets/T_Tree_Pine_Snow_04.png');
  this.load.image('tree_pine_snow_05', 'assets/T_Tree_Pine_Snow_05.png');
  
  // Load building sprites
  this.load. image('buildings/villager_hut', 'assets/T_ResidentialHouse_Snow_01.png');
  this.load.image('buildings/longhouse', 'assets/T_ResidentialHouse_Snow_02.png');
  this.load.image('buildings/well', 'assets/T_Well_Snow_02.png');
  this.load.image('buildings/fishing_hut', 'assets/T_ResidentialHouse_Snow_01.png');
  this.load.image('buildings/lumber_camp', 'assets/T_ResidentialHouse_Snow_02.png');
  this.load.image('buildings/farm', 'assets/T_ResidentialHouse_Snow_02.png');
  this.load.image('buildings/storage', 'assets/T_ResidentialHouse_Snow_01.png');
  this.load.image('buildings/palisade_wall', 'assets/T_ResidentialHouse_Snow_02.png');
  this.load.image('buildings/dock', 'assets/T_ResidentialHouse_Snow_02.png');
  this.load.image('buildings/boat', 'assets/T_ResidentialHouse_Snow_01.png');
  
  // Load creature placeholders (keep these for now)
  // ...  existing creature loading code ...
  
  // Update loading bar
  this.load.on('progress', (value) => {
    this.progressBar.clear();
    this.progressBar. fillStyle(0x88ccff, 1);
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
    // Generate minimal placeholders only for assets without PNG sprites
    this.generateMinimalPlaceholders();
    
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

  generateMinimalPlaceholders() {
    // Only generate placeholders for assets that don't have PNG sprites yet
    // This ensures the custom sprites (ground, trees, houses, well) are NOT overwritten
    
    // Building - Fishing Hut (brown) - only if not already loaded
    if (!this.textures.exists('buildings/fishing_hut')) {
      const fishingHutTexture = this.add.graphics();
      fishingHutTexture.fillStyle(0x8b4513, 1);
      fishingHutTexture.fillRect(0, 0, 64, 48);
      fishingHutTexture.generateTexture('buildings/fishing_hut', 64, 48);
      fishingHutTexture.destroy();
    }
    
    // Building - Lumber Camp (dark brown)
    if (!this.textures.exists('buildings/lumber_camp')) {
      const lumberCampTexture = this.add.graphics();
      lumberCampTexture.fillStyle(0x654321, 1);
      lumberCampTexture.fillRect(0, 0, 64, 48);
      lumberCampTexture.generateTexture('buildings/lumber_camp', 64, 48);
      lumberCampTexture.destroy();
    }
    
    // Building - Farm (light brown)
    if (!this.textures.exists('buildings/farm')) {
      const farmTexture = this.add.graphics();
      farmTexture.fillStyle(0xdaa520, 1);
      farmTexture.fillRect(0, 0, 128, 48);
      farmTexture.generateTexture('buildings/farm', 128, 48);
      farmTexture.destroy();
    }
    
    // Building - Storage (gray-brown)
    if (!this.textures.exists('buildings/storage')) {
      const storageTexture = this.add.graphics();
      storageTexture.fillStyle(0x8b7355, 1);
      storageTexture.fillRect(0, 0, 64, 48);
      storageTexture.generateTexture('buildings/storage', 64, 48);
      storageTexture.destroy();
    }
    
    // Building - Palisade Wall (brown sticks)
    if (!this.textures.exists('buildings/palisade_wall')) {
      const palisadeTexture = this.add.graphics();
      palisadeTexture.fillStyle(0x8b6914, 1);
      palisadeTexture.fillRect(0, 0, 64, 48);
      palisadeTexture.generateTexture('buildings/palisade_wall', 64, 48);
      palisadeTexture.destroy();
    }
    
    // Building - Dock (brown wood)
    if (!this.textures.exists('buildings/dock')) {
      const dockTexture = this.add.graphics();
      dockTexture.fillStyle(0x8B6914, 1);
      dockTexture.fillRect(0, 0, 128, 64);
      dockTexture.generateTexture('buildings/dock', 128, 64);
      dockTexture.destroy();
    }
    
    // Building - Boat (dark wood)
    if (!this.textures.exists('buildings/boat')) {
      const boatTexture = this.add.graphics();
      boatTexture.fillStyle(0x654321, 1);
      boatTexture.fillRect(0, 0, 64, 48);
      boatTexture.generateTexture('buildings/boat', 64, 48);
      boatTexture.destroy();
    }
    
    // Creature - Troll (red)
    if (!this.textures.exists('creatures/troll')) {
      const trollTexture = this.add.graphics();
      trollTexture.fillStyle(0xff4444, 1);
      trollTexture.fillRect(0, 0, 48, 48);
      trollTexture.generateTexture('creatures/troll', 48, 48);
      trollTexture.destroy();
    }
    
    // Creature - Gnome (yellow)
    if (!this.textures.exists('creatures/gnome')) {
      const gnomeTexture = this.add.graphics();
      gnomeTexture.fillStyle(0xffdd44, 1);
      gnomeTexture.fillRect(0, 0, 32, 32);
      gnomeTexture.generateTexture('creatures/gnome', 32, 32);
      gnomeTexture.destroy();
    }
    
    // Creature - Draugr (dark red)
    if (!this.textures.exists('creatures/draugr')) {
      const draugrTexture = this.add.graphics();
      draugrTexture.fillStyle(0x8b0000, 1);
      draugrTexture.fillRect(0, 0, 48, 48);
      draugrTexture.generateTexture('creatures/draugr', 48, 48);
      draugrTexture.destroy();
    }
    
    // Villager sprite - simple humanoid shape
    if (!this.textures.exists('villager')) {
      const villagerTexture = this.add.graphics();
      villagerTexture.fillStyle(0xFFDBB4, 1); // Skin tone
      villagerTexture.fillRect(8, 0, 16, 16); // Head
      villagerTexture.fillStyle(0x4169E1, 1); // Blue tunic
      villagerTexture.fillRect(4, 16, 24, 24); // Body
      villagerTexture.generateTexture('villager', 32, 48);
      villagerTexture.destroy();
    }
  }
}
