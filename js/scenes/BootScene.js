/**
 * BootScene - Asset Loading Scene
 * 
 * This scene loads all game assets and data files before starting the game.
 * It shows a loading screen and transitions to the main menu when complete.
 */

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    this.createLoadingScreen();
    
    // Load JSON data files
    this.load.json('configData', 'src/data/config.json');
    this.load.json('resourcesData', 'src/data/resources.json');
    this.load.json('buildingsData', 'src/data/buildings.json');
    this.load.json('creaturesData', 'src/data/creatures.json');
    this.load.json('randomEventsData', 'src/data/events/random-events.json');
    this.load.json('seasonalEventsData', 'src/data/events/seasonal-events.json');
    this.load.json('storyEventsData', 'src/data/events/story-events.json');
    this.load.json('seasonsData', 'src/data/seasons.json');
    this.load.json('progressionData', 'src/data/progression.json');
    this.load.json('dialogue_troll', 'src/data/dialogues/creatures/troll_encounter.json');
    this.load.json('dialogue_gnome', 'src/data/dialogues/creatures/gnome_encounter.json');
    
    // Load snow ground tiles with correct keys
    this.load.image('tile_snow_ground_01', 'assets/T_Ground_Snow_01.png');
    this.load.image('tile_snow_ground_02', 'assets/T_Ground_Snow_02.png');
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
    this.load.image('buildings/residential_house_snow_01', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/residential_house_snow_02', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/well_snow', 'assets/T_Well_Snow_02.png');
    this.load.image('buildings/villager_hut', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/longhouse', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/well', 'assets/T_Well_Snow_02.png');
    this.load.image('buildings/fishing_hut', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/lumber_camp', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/farm', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/storage', 'assets/T_ResidentialHouse_Snow_01.png');
    this.load.image('buildings/palisade_wall', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/dock', 'assets/T_ResidentialHouse_Snow_02.png');
    this.load.image('buildings/boat', 'assets/T_ResidentialHouse_Snow_01.png');
    
    // Update loading bar
    this.load.on('progress', (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x88ccff, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
      this.percentText.setText(parseInt(value * 100) + '%');
    });
    
    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
    });
  }

  create() {
    // Store loaded JSON data in registry for access by other scenes
    this.registry.set('configData', this.cache.json.get('configData'));
    this.registry.set('resourcesData', this.cache.json.get('resourcesData'));
    this.registry.set('buildingsData', this.cache.json.get('buildingsData'));
    this.registry.set('creaturesData', this.cache.json.get('creaturesData'));
    this.registry.set('randomEventsData', this.cache.json.get('randomEventsData'));
    this.registry.set('seasonalEventsData', this.cache.json.get('seasonalEventsData'));
    this.registry.set('storyEventsData', this.cache.json.get('storyEventsData'));
    this.registry.set('seasonsData', this.cache.json.get('seasonsData'));
    this.registry.set('progressionData', this.cache.json.get('progressionData'));
    this.registry.set('dialogue_troll', this.cache.json.get('dialogue_troll'));
    this.registry.set('dialogue_gnome', this.cache.json.get('dialogue_gnome'));
    
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
  }

  generateMinimalPlaceholders() {
    // Only generate placeholders for assets that don't have PNG sprites yet
    // This ensures the custom sprites (ground, trees, houses, well) are NOT overwritten
    
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
