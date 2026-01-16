/**
 * VillageScene - Main Gameplay Scene
 * 
 * Renders the isometric village map and handles game logic.
 * Integrates all game systems and communicates with React UI.
 */

import Phaser from 'phaser';
import { eventBridge } from '../EventBridge.js';
import { ResourceManager } from '../systems/ResourceManager.js';
import { BuildingSystem } from '../systems/BuildingSystem.js';
import { EventSystem } from '../systems/EventSystem.js';
import { DialogueSystem } from '../systems/DialogueSystem.js';
import { SeasonSystem } from '../systems/SeasonSystem.js';
import { CreatureSystem } from '../systems/CreatureSystem.js';
import { VillagerSystem } from '../systems/VillagerSystem.js';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    // Initialize game data
    this.initializeData();
    
    // Initialize game systems
    this.initializeSystems();
    
    // Create the map
    this.createMap();
    
    // Setup camera controls
    this.setupCameraControls();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load saved game if available
    const loadedSave = this.registry.get('loadedSave');
    if (loadedSave) {
      this.loadGameState(loadedSave);
      this.registry.remove('loadedSave');
    } else {
      // Start new game
      this.startNewGame();
    }
    
    // Emit initial update to React
    this.resourceManager.emitUpdate();
    
    // Setup input for building placement
    this.input.on('pointerdown', (pointer) => {
      this.handleMapClick(pointer);
    });
  }

  initializeData() {
    this.configData = this.registry.get('configData');
    this.resourcesData = this.registry.get('resourcesData');
    this.buildingsData = this.registry.get('buildingsData');
    this.creaturesData = this.registry.get('creaturesData');
    this.randomEventsData = this.registry.get('randomEventsData');
    this.seasonalEventsData = this.registry.get('seasonalEventsData');
    this.storyEventsData = this.registry.get('storyEventsData');
    this.seasonsData = this.registry.get('seasonsData');
    this.progressionData = this.registry.get('progressionData');
    
    // Map dimensions
    this.mapWidth = 24;
    this.mapHeight = 20;
    this.tileWidth = 64;
    this.tileHeight = 32;
  }

  initializeSystems() {
    // Create game systems
    this.resourceManager = new ResourceManager(this);
    this.buildingSystem = new BuildingSystem(this);
    this.eventSystem = new EventSystem(this);
    this.dialogueSystem = new DialogueSystem(this);
    this.seasonSystem = new SeasonSystem(this);
    this.creatureSystem = new CreatureSystem(this);
    this.villagerSystem = new VillagerSystem(this);
    
    // Initialize systems with data
    this.buildingSystem.init(this.buildingsData);
    this.eventSystem.init(
      this.randomEventsData,
      this.seasonalEventsData,
      this.storyEventsData,
      this.configData
    );
    this.seasonSystem.init(this.seasonsData, this.configData);
    this.creatureSystem.init(this.creaturesData, this.configData);
    this.villagerSystem.init();
    
    // Load dialogues
    const trollDialogue = this.registry.get('dialogue_troll');
    const gnomeDialogue = this.registry.get('dialogue_gnome');
    this.dialogueSystem.loadDialogue('troll_encounter', trollDialogue);
    this.dialogueSystem.loadDialogue('gnome_encounter', gnomeDialogue);
  }

  startNewGame() {
    // Initialize resources
    this.resourceManager.init(this.resourcesData, this.configData);
    
    // Place starting buildings
    // 3 longhouses/villager huts in the village center
    this.buildingSystem.placeStartingBuilding(10, 7, 'villager_hut');
    this.buildingSystem.placeStartingBuilding(12, 7, 'villager_hut');
    this.buildingSystem.placeStartingBuilding(14, 9, 'villager_hut');
    
    // Fishing dock adjacent to water (water starts at y=16, so y=15 is adjacent)
    this.buildingSystem.placeStartingBuilding(12, 14, 'fishing_dock');
    
    // Boat on water (y >= 16 is water)
    this.buildingSystem.placeStartingBuilding(12, 16, 'boat');
    
    // Well in village center
    this.buildingSystem.placeStartingBuilding(12, 10, 'well');
    
    // Create sprites for starting buildings
    this.buildingSystem.buildings.forEach(building => {
      this.createBuildingSprite(building.x, building.y);
    });
    
    // Spawn initial villagers
    const population = this.resourceManager.get('population');
    this.villagerSystem.updateVillagers(population, this.buildingSystem.buildings);
    
    // Emit initial state
    eventBridge.emit('game:started');
  }

  createMap() {
    // Create container for isometric tiles
    // Center the map based on screen dimensions
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.mapContainer = this.add.container(centerX, centerY - 100);
    
    // Generate map data
    this.mapData = this.generateMapData();
    
    // Create tile sprites
    this.tiles = [];
    for (let y = 0; y < this.mapHeight; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.mapWidth; x++) {
        const pos = this.getIsoPosition(x, y);
        const tileType = this.mapData[y][x];
        
        const tile = this.add.sprite(pos.x, pos.y, 'tile_' + tileType);
        tile.setOrigin(0.5, 0.5);
        tile.setData('gridX', x);
        tile.setData('gridY', y);
        tile.setInteractive();
        
        this.tiles[y][x] = tile;
        this.mapContainer.add(tile);
      }
    }
    
    // Create container for buildings and creatures
    this.entityContainer = this.add.container(centerX, centerY - 100);
  }

  generateMapData() {
    const map = [];
    for (let y = 0; y < this.mapHeight; y++) {
      const row = [];
      for (let x = 0; x < this.mapWidth; x++) {
        // Forest at outer edges (2 layers)
        if (x <= 1 || x >= this.mapWidth - 2 || y <= 1 || y >= this.mapHeight - 2) {
          row.push('forest');
        }
        // Water in bottom section (near edge)
        else if (y >= this.mapHeight - 4) {
          row.push('water');
        }
        // Mountains at inner edge (after forest)
        else if (x === 2 || x === this.mapWidth - 3 || y === 2) {
          row.push('mountain');
        }
        // Path from center to water (vertical path)
        else if (x === Math.floor(this.mapWidth / 2) && y >= 10) {
          row.push('path');
        }
        // Horizontal paths in village center
        else if (y === 8 && x >= 8 && x <= 16) {
          row.push('path');
        }
        else if (y === 11 && x >= 8 && x <= 16) {
          row.push('path');
        }
        // Grass everywhere else
        else {
          row.push('grass');
        }
      }
      map.push(row);
    }
    return map;
  }

  getIsoPosition(x, y) {
    return {
      x: (x - y) * (this.tileWidth / 2),
      y: (x + y) * (this.tileHeight / 2)
    };
  }

  setupCameraControls() {
    // Enable camera dragging with larger bounds for bigger map
    this.cameras.main.setBounds(-800, -600, 2400, 1800);
    
    // WASD keys for camera movement
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');
    
    // Mouse wheel zoom (optional for later)
    // this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    //   // Handle zoom
    // });
  }

  setupEventListeners() {
    // Listen for React commands
    eventBridge.on('game:endTurn', () => this.processTurn());
    eventBridge.on('game:save', () => this.saveGame());
    eventBridge.on('building:select', (data) => this.handleBuildingSelection(data));
    eventBridge.on('dialogue:choice', (data) => this.handleDialogueChoice(data));
    eventBridge.on('creature:interact', (data) => this.handleCreatureInteraction(data));
    eventBridge.on('building:assign_worker', (data) => this.handleAssignWorker(data));
    eventBridge.on('building:remove_worker', (data) => this.handleRemoveWorker(data));
    eventBridge.on('building:upgrade', (data) => this.handleBuildingUpgrade(data));
  }

  handleMapClick(pointer) {
    // Convert screen position to world position
    const worldX = pointer.worldX - this.mapContainer.x;
    const worldY = pointer.worldY - this.mapContainer.y;
    
    // Convert isometric to grid coordinates
    const gridPos = this.worldToGrid(worldX, worldY);
    
    // Check if clicking on a building
    const clickedBuilding = this.buildingSystem.buildings.find(b => b.x === gridPos.x && b.y === gridPos.y);
    if (clickedBuilding) {
      eventBridge.emit('building:clicked', { building: clickedBuilding });
      return;
    }
    
    // Check if in placement mode
    if (this.buildingSystem.placementMode) {
      this.attemptBuildingPlacement(gridPos.x, gridPos.y);
    }
  }

  worldToGrid(worldX, worldY) {
    const x = Math.floor((worldX / (this.tileWidth / 2) + worldY / (this.tileHeight / 2)) / 2);
    const y = Math.floor((worldY / (this.tileHeight / 2) - worldX / (this.tileWidth / 2)) / 2);
    return { x, y };
  }

  handleBuildingSelection(data) {
    const { buildingId } = data;
    this.buildingSystem.enterPlacementMode(buildingId);
  }

  attemptBuildingPlacement(x, y) {
    if (!this.buildingSystem.selectedBuilding) return;
    
    const selectedBuildingId = this.buildingSystem.selectedBuilding.id;
    
    // Validate placement
    if (!this.buildingSystem.isValidPlacement(x, y, this.buildingSystem.selectedBuilding, this.mapData)) {
      eventBridge.emit('building:invalid_placement', { x, y });
      return;
    }
    
    // Place building
    const success = this.buildingSystem.placeBuilding(x, y, selectedBuildingId, this.resourceManager);
    
    if (success) {
      // Create building sprite
      this.createBuildingSprite(x, y);
      
      // Exit placement mode
      this.buildingSystem.exitPlacementMode();
    }
  }

  createBuildingSprite(x, y) {
    const pos = this.getIsoPosition(x, y);
    const building = this.buildingSystem.buildings.find(b => b.x === x && b.y === y);
    
    if (!building) return;
    
    const sprite = this.add.sprite(pos.x, pos.y - 16, building.definition.sprite);
    sprite.setOrigin(0.5, 1);
    sprite.setData('building', building);
    
    this.entityContainer.add(sprite);
  }

  processTurn() {
    // Advance turn
    this.resourceManager.nextTurn();
    
    // Get current state
    const currentSeason = this.seasonSystem.getCurrentSeasonId();
    const currentEra = this.resourceManager.get('era');
    const seasonModifiers = this.seasonSystem.getSeasonModifiers();
    const currentTurn = this.resourceManager.get('turn');
    const gracePeriod = this.configData.grace_period_turns || 3;
    
    // Process season
    this.seasonSystem.processTurn();
    
    // Process buildings
    this.buildingSystem.processTurn(this.resourceManager, seasonModifiers);
    
    // Update villagers based on population
    const population = this.resourceManager.get('population');
    this.villagerSystem.updateVillagers(population, this.buildingSystem.buildings);
    
    // Consumption
    const foodConsumption = population * this.configData.consumption_rates.food_per_villager;
    
    this.resourceManager.remove('food', foodConsumption);
    
    // Check for starvation
    if (this.resourceManager.get('food') < 0) {
      const deficit = Math.abs(this.resourceManager.get('food'));
      const deaths = Math.ceil(deficit / this.configData.consumption_rates.food_per_villager);
      
      this.resourceManager.set('food', 0);
      this.resourceManager.remove('population', deaths);
      this.resourceManager.remove('morale', 15);
      
      eventBridge.emit('event:starvation', { deaths });
      
      // Update villagers after deaths
      this.villagerSystem.updateVillagers(this.resourceManager.get('population'), this.buildingSystem.buildings);
    }
    
    // Check for events (only after grace period)
    if (currentTurn > gracePeriod) {
      const events = this.eventSystem.checkEvents(currentSeason, currentEra, this.resourceManager);
      
      if (events.length > 0) {
        events.forEach(event => {
          this.eventSystem.triggerEvent(event);
          
          // Apply automatic effects
          if (!event.choices || event.choices.length === 0) {
            this.eventSystem.applyEventEffects(event.effects, this.resourceManager);
          }
        });
      }
      
      // Check for creature spawns (only after grace period)
      this.creatureSystem.checkSpawns(currentSeason, currentEra);
    }
    
    // Check game over
    this.checkGameOver();
    
    // Auto-save
    this.saveGame();
  }

  handleDialogueChoice(data) {
    const { choiceIndex } = data;
    this.dialogueSystem.selectChoice(choiceIndex, this.resourceManager);
  }

  handleCreatureInteraction(data) {
    const { creatureId } = data;
    this.creatureSystem.interactWithCreature(creatureId);
  }

  handleAssignWorker(data) {
    const building = this.buildingSystem.buildings.find(b => 
      b.id === data.buildingId || (b.x + ',' + b.y) === data.buildingId
    );
    
    if (building) {
      const maxWorkers = building.definition.workers?.max || 0;
      if (building.workers < maxWorkers) {
        building.workers++;
        eventBridge.emit('building:worker_assigned', { building });
        // Force UI update
        this.resourceManager.emitUpdate();
      }
    }
  }

  handleRemoveWorker(data) {
    const building = this.buildingSystem.buildings.find(b => 
      b.id === data.buildingId || (b.x + ',' + b.y) === data.buildingId
    );
    
    if (building && building.workers > 0) {
      building.workers--;
      eventBridge.emit('building:worker_removed', { building });
      // Force UI update
      this.resourceManager.emitUpdate();
    }
  }

  handleBuildingUpgrade(data) {
    // TODO: Implement building upgrade system
    console.log('Building upgrade not yet implemented:', data);
  }

  checkGameOver() {
    const population = this.resourceManager.get('population');
    const morale = this.resourceManager.get('morale');
    
    if (population <= 0) {
      eventBridge.emit('game:over', { 
        reason: 'All villagers have perished.' 
      });
    } else if (morale <= 0) {
      eventBridge.emit('game:over', { 
        reason: 'The villagers have lost all hope and abandoned the village.' 
      });
    }
  }

  saveGame() {
    const saveData = {
      version: '1.0',
      timestamp: Date.now(),
      resources: this.resourceManager.getSaveState(),
      buildings: this.buildingSystem.getSaveState(),
      events: this.eventSystem.getSaveState(),
      season: this.seasonSystem.getSaveState(),
      creatures: this.creatureSystem.getSaveState(),
      villagers: this.villagerSystem.getSaveState()
    };
    
    localStorage.setItem('northernjourney_save', JSON.stringify(saveData));
    eventBridge.emit('game:saved');
  }

  loadGameState(saveData) {
    this.resourceManager.loadState(saveData.resources);
    this.buildingSystem.loadState(saveData.buildings);
    this.eventSystem.loadState(saveData.events);
    this.seasonSystem.loadState(saveData.season);
    this.creatureSystem.loadState(saveData.creatures);
    
    // Recreate building sprites
    this.buildingSystem.buildings.forEach(building => {
      this.createBuildingSprite(building.x, building.y);
    });
    
    // Recreate villagers
    if (saveData.villagers) {
      this.villagerSystem.loadState(saveData.villagers, this.buildingSystem.buildings);
    }
    
    eventBridge.emit('game:loaded');
  }

  update() {
    // Camera movement
    const camSpeed = 5;
    
    if (this.cursors.left.isDown || this.keys.A.isDown) {
      this.cameras.main.scrollX -= camSpeed;
    }
    if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.cameras.main.scrollX += camSpeed;
    }
    if (this.cursors.up.isDown || this.keys.W.isDown) {
      this.cameras.main.scrollY -= camSpeed;
    }
    if (this.cursors.down.isDown || this.keys.S.isDown) {
      this.cameras.main.scrollY += camSpeed;
    }
  }
}
