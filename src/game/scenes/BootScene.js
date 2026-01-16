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
    
    // Load new sprite assets
    // Ground tiles - Load with keys that match usage in VillageScene
    this.load.image('tile_grass', 'assets/T_Ground_Snow_01.png'); // Main grass tile replaced with snow
    this.load.image('tile_snow_ground_01', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_snow_ground_02', 'assets/T_Ground_Snow_02.png');
    
    // Trees
    this.load.image('tree_pine_snow_01', 'assets/T_Tree_Pine_Snow_01.png');
    this.load.image('tree_pine_snow_02', 'assets/T_Tree_Pine_Snow_02.png');
    this.load.image('tree_pine_snow_03', 'assets/T_Tree_Pine_Snow_03.png');
    this.load.image('tree_pine_snow_04', 'assets/T_Tree_Pine_Snow_04.png');
    this.load.image('tree_pine_snow_05', 'assets/T_Tree_Pine_Snow_05.png');
    
    // Buildings - Load with both base keys (used by building system) and variant keys (used for snow theme)
    // Villager hut: base key + snow variants for randomization in VillageScene
    this.load.image('buildings/villager_hut', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/residential_house_snow_01', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/residential_house_snow_02', 'assets/T_ResidentialHouse_Snow_02.png');
    // Well: base key + snow variant
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
    // Generate placeholder sprites
    this.generatePlaceholders();
    
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

  generatePlaceholders() {
    // Generate colored placeholder graphics for game elements
    // Only create placeholders for textures that don't already exist
    
    // Snow tiles - use loaded assets if available, otherwise create placeholders
    // The loaded assets have keys: tile_snow_ground_01, tile_snow_ground_02
    // We'll create aliases for backward compatibility
    if (!this.textures.exists('tile_snow')) {
      const snowTexture = this.add.graphics();
      snowTexture.fillStyle(0xf0f8ff, 1); // Light snow color
      snowTexture.fillRect(0, 0, 64, 32);
      snowTexture.generateTexture('tile_snow', 64, 32);
      snowTexture.destroy();
    }
    
    // Grass tile - already loaded as snow sprite in preload(), skip placeholder
    // Don't create placeholder for tile_grass - it's now using the snow sprite
    
    // Water tile (blue)
    const waterTexture = this.add.graphics();
    waterTexture.fillStyle(0x3b5c7c, 1);
    waterTexture.fillRect(0, 0, 64, 32);
    waterTexture.generateTexture('tile_water', 64, 32);
    waterTexture.destroy();
    
    // Mountain tile (gray)
    const mountainTexture = this.add.graphics();
    mountainTexture.fillStyle(0x6c6c6c, 1);
    mountainTexture.fillRect(0, 0, 64, 32);
    mountainTexture.generateTexture('tile_mountain', 64, 32);
    mountainTexture.destroy();
    
    // Forest tile - dark green
    const forestTexture = this.add.graphics();
    forestTexture.fillStyle(0x2d5016, 1);
    forestTexture.fillRect(0, 0, 64, 32);
    forestTexture.generateTexture('tile_forest', 64, 32);
    forestTexture.destroy();

    // Path tile - tan/brown
    const pathTexture = this.add.graphics();
    pathTexture.fillStyle(0x8B7355, 1);
    pathTexture.fillRect(0, 0, 64, 32);
    pathTexture.generateTexture('tile_path', 64, 32);
    pathTexture.destroy();
    
    // Building - Fishing Hut (brown)
    const fishingHutTexture = this.add.graphics();
    fishingHutTexture.fillStyle(0x8b4513, 1);
    fishingHutTexture.fillRect(0, 0, 64, 48);
    fishingHutTexture.generateTexture('buildings/fishing_hut', 64, 48);
    fishingHutTexture.destroy();
    
    // Building - Lumber Camp (dark brown)
    const lumberCampTexture = this.add.graphics();
    lumberCampTexture.fillStyle(0x654321, 1);
    lumberCampTexture.fillRect(0, 0, 64, 48);
    lumberCampTexture.generateTexture('buildings/lumber_camp', 64, 48);
    lumberCampTexture.destroy();
    
    // Building - Farm (light brown)
    const farmTexture = this.add.graphics();
    farmTexture.fillStyle(0xdaa520, 1);
    farmTexture.fillRect(0, 0, 128, 48);
    farmTexture.generateTexture('buildings/farm', 128, 48);
    farmTexture.destroy();
    
    // Building - Storage (gray-brown)
    const storageTexture = this.add.graphics();
    storageTexture.fillStyle(0x8b7355, 1);
    storageTexture.fillRect(0, 0, 64, 48);
    storageTexture.generateTexture('buildings/storage', 64, 48);
    storageTexture.destroy();
    
    // Building - Villager Hut - already loaded as snow sprite, skip placeholder
    // Don't create placeholder - using loaded snow residential house sprites
    
    // Building - Longhouse (dark wood)
    const longhouseTexture = this.add.graphics();
    longhouseTexture.fillStyle(0x5c3317, 1);
    longhouseTexture.fillRect(0, 0, 192, 96);
    longhouseTexture.generateTexture('buildings/longhouse', 192, 96);
    longhouseTexture.destroy();
    
    // Building - Palisade Wall (brown sticks)
    const palisadeTexture = this.add.graphics();
    palisadeTexture.fillStyle(0x8b6914, 1);
    palisadeTexture.fillRect(0, 0, 64, 48);
    palisadeTexture.generateTexture('buildings/palisade_wall', 64, 48);
    palisadeTexture.destroy();
    
    // Building - Well - already loaded as snow sprite, skip placeholder
    // Don't create placeholder - using loaded snow well sprite
    
    // Building - Dock (brown wood)
    const dockTexture = this.add.graphics();
    dockTexture.fillStyle(0x8B6914, 1);
    dockTexture.fillRect(0, 0, 128, 64);
    dockTexture.generateTexture('buildings/dock', 128, 64);
    dockTexture.destroy();
    
    // Building - Boat (dark wood)
    const boatTexture = this.add.graphics();
    boatTexture.fillStyle(0x654321, 1);
    boatTexture.fillRect(0, 0, 64, 48);
    boatTexture.generateTexture('buildings/boat', 64, 48);
    boatTexture.destroy();
    
    // Creature - Troll (red)
    const trollTexture = this.add.graphics();
    trollTexture.fillStyle(0xff4444, 1);
    trollTexture.fillRect(0, 0, 48, 48);
    trollTexture.generateTexture('creatures/troll', 48, 48);
    trollTexture.destroy();
    
    // Creature - Gnome (yellow)
    const gnomeTexture = this.add.graphics();
    gnomeTexture.fillStyle(0xffdd44, 1);
    gnomeTexture.fillRect(0, 0, 32, 32);
    gnomeTexture.generateTexture('creatures/gnome', 32, 32);
    gnomeTexture.destroy();
    
    // Creature - Draugr (dark red)
    const draugrTexture = this.add.graphics();
    draugrTexture.fillStyle(0x8b0000, 1);
    draugrTexture.fillRect(0, 0, 48, 48);
    draugrTexture.generateTexture('creatures/draugr', 48, 48);
    draugrTexture.destroy();
    
    // Villager sprite - simple humanoid shape
    const villagerTexture = this.add.graphics();
    villagerTexture.fillStyle(0xFFDBB4, 1); // Skin tone
    villagerTexture.fillRect(8, 0, 16, 16); // Head
    villagerTexture.fillStyle(0x4169E1, 1); // Blue tunic
    villagerTexture.fillRect(4, 16, 24, 24); // Body
    villagerTexture.generateTexture('villager', 32, 48);
    villagerTexture.destroy();
  }
}
